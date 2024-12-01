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

  private createSheetFromData(file: Express.Multer.File): XLSX.WorkSheet {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];

    return worksheet;
  }
}