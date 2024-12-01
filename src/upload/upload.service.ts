import { Injectable } from "@nestjs/common";
import { UploadServiceInterface } from "./interface/upload.service.interface";
import * as XLSX from 'xlsx';

interface ITypeReturnFile {
    sheetNames: string[];
    data: unknown[]
}

@Injectable()
export class UploadService implements UploadServiceInterface {
    uploadXlsx(file: Express.Multer.File): ITypeReturnFile {
          const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      
          const sheetNames = workbook.SheetNames;
      
          const worksheet = workbook.Sheets[sheetNames[0]];
      
          const data = XLSX.utils.sheet_to_json(worksheet);

          return {
            sheetNames,
            data,
          };
    }
}