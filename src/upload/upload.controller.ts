import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadServiceInterface } from "./interface/upload.service.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { IReturnFile } from "./interface/upload.interface";

@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadServiceInterface
    ) {}

    @Post('xlsx')
    @UseInterceptors(FileInterceptor('file')) 
    uploadXlsx(@UploadedFile() file: Express.Multer.File): Promise<IReturnFile> {
        if(!file) {
            throw new BadRequestException('Arquivo é obrigatório');
        }

        return this.uploadService.uploadXlsx(file)
    }
}