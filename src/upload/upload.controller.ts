import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadServiceInterface } from "./interface/upload.service.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { IReturnFile } from "./interface/upload.interface";
import { ValidatedFile } from "./decorator/file-validation.decorator";

@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadServiceInterface
    ) {}

    @Post('xlsx')
    @UseInterceptors(FileInterceptor('file')) 
    uploadXlsx(@ValidatedFile() file: Express.Multer.File): Promise<IReturnFile> {
        return this.uploadService.uploadXlsx(file)
    }

    @Post('txt')
    @UseInterceptors(FileInterceptor('file'))
    async uploadTxt(@ValidatedFile() file: Express.Multer.File): Promise<IReturnFile> { 
      return this.uploadService.uploadTxt(file);
    }
}