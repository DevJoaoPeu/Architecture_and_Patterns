import { Injectable } from "@nestjs/common";
import { UploadServiceInterface } from "./interface/upload.service.interface";
import * as XLSX from 'xlsx';
import { UserServiceInterface } from "src/user/interface/user.service.interface";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { IReturnFile } from "./interface/upload.interface";

@Injectable()
export class UploadService implements UploadServiceInterface {
  constructor(
    private readonly userService: UserServiceInterface
  ) {}

  async uploadXlsx(file: Express.Multer.File): Promise<IReturnFile> {
    const worksheet = this.createSheetFromData(file);
  
    let data: CreateUserDto[] = XLSX.utils.sheet_to_json(worksheet);
    this.removeDuplicateRecords(data, 'email');
    await this.insertUsers(data);
  
    return {
      sucess: true,
      message: 'Arquivo inserido com sucesso'
    }
  }

  private removeDuplicateRecords<T>(data: T[], uniqueKey: keyof T): T[] {
    const uniqueValues = new Set<any>();
  
    return data.filter(record => {
      const value = record[uniqueKey];
      if (uniqueValues.has(value)) {
        return false;
      }
      uniqueValues.add(value);
      return true;
    });
  }

  private async insertUsers(data: CreateUserDto[]): Promise<void> {
    const batchSize = 1000;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch: CreateUserDto[] = data.slice(i, i + batchSize);
      await this.userService.createMany(batch);
    }
  }

  private createSheetFromData(file: Express.Multer.File): XLSX.WorkSheet {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];

    return worksheet;
  }
}