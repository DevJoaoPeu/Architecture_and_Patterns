import { Injectable } from "@nestjs/common";
import { UploadServiceInterface } from "./interface/upload.service.interface";
import * as XLSX from 'xlsx';
import { UserServiceInterface } from "src/user/interface/user.service.interface";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { IReturnFile } from "./interface/upload.interface";
import { UploadUseCasesInterface } from "./interface/upload.use-cases.interface";

@Injectable()
export class UploadService implements UploadServiceInterface {
  constructor(
    private readonly uploadUseCase: UploadUseCasesInterface,
  ) {}

  async uploadXlsx(file: Express.Multer.File): Promise<IReturnFile> {
    const worksheet = this.createSheetFromData(file);
  
    let data: CreateUserDto[] = XLSX.utils.sheet_to_json(worksheet);
    this.uploadUseCase.removeDuplicateRecords(data, 'email');
    await this.uploadUseCase.insertUsers(data);
  
    return {
      sucess: true,
      message: 'Arquivo inserido com sucesso'
    }
  } 

  async uploadTxt(file: Express.Multer.File): Promise<IReturnFile> {
    const processFile: CreateUserDto[] = this.processFileTxt(file.buffer);

    this.uploadUseCase.removeDuplicateRecords(processFile, 'email');
    await this.uploadUseCase.insertUsers(processFile);

    return {
      sucess: true,
      message: 'Arquivo inserido com sucesso'
    }
  }

  private createSheetFromData(file: Express.Multer.File): XLSX.WorkSheet {
    const workbook: XLSX.WorkBook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetNames: string[] = workbook.SheetNames;
    const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetNames[0]];

    return worksheet;
  }

  private processFileTxt(buffer: Buffer): CreateUserDto[] {
    const fileContent: string = buffer.toString('utf-8');
  
    const lines = fileContent
      .split('\n')
      .map((line: string): string => line.trim())
      .filter((line: string): boolean => !!line);
  
    const headers: (keyof CreateUserDto)[] = ['name', 'surname', 'email'];
  
    return lines.map((line: string): CreateUserDto => {
      const values = line.split(';').map((value: string): string => value.trim());
  
      const user: CreateUserDto = {
        name: values[0] || '', 
        surname: values[1] || '', 
        email: values[2] || '', 
      };
  
      return user;
    });
  }
}