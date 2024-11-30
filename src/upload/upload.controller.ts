import { Body, Controller, Post } from "@nestjs/common";
import { UploadServiceInterface } from "./interface/upload.service.interface";

@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadServiceInterface
    ) {}

    @Post('xlsx')
    upload_xlsx(@Body() file: any): void {
        return this.uploadService.upload_xlsx(file)
    }
}