import { Injectable } from "@nestjs/common";
import { UploadServiceInterface } from "./interface/upload.service.interface";
import * as XLSX from 'xlsx';
import { UserServiceInterface } from "src/user/interface/user.interface";
import { CreateUserDto } from "src/user/dto/create-user.dto";

interface ITypeReturnFile {
    sheetNames: string[];
    data: unknown[]
}

interface ICreateUser {
  name: string;
  email: string;
  surname: string
}

@Injectable()
export class UploadService implements UploadServiceInterface {
  constructor(
    private readonly userService: UserServiceInterface
  ) {}

  async uploadXlsx(file: Express.Multer.File): Promise<void> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetNames[0]];
  
    let data: CreateUserDto[] = XLSX.utils.sheet_to_json(worksheet);
  
    const uniqueEmails = new Set<string>();
    data = data.filter(user => {
      if (uniqueEmails.has(user.email)) {
        return false; 
      }
      uniqueEmails.add(user.email);
      return true;
    });
  
    const batchSize = 1000;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await this.userService.createMany(batch);
    }
  
    console.log('Usuários inseridos com sucesso!');
  }
}