import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { UploadServiceInterface } from "./interface/upload.service.interface";

@Module({
    controllers: [UploadController],
    providers: [
        {
            provide: UploadServiceInterface,
            useClass: UploadService
        }
    ],
    exports: []
})
export class UploadModule {}