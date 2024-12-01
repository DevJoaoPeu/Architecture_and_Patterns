import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadServiceInterface } from "./interface/upload.service.interface";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadServiceInterface
    ) {}

    @Post('xlsx')
    @UseInterceptors(FileInterceptor('file')) 
    uploadXlsx(@UploadedFile() file: Express.Multer.File): void {
        if(!file) {
            throw new BadRequestException('Arquivo é obrigatório');
        }

        return this.uploadService.uploadXlsx(file)
    }
}