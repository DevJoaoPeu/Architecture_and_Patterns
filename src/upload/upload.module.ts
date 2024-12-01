import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { UploadServiceInterface } from "./interface/upload.service.interface";
import { UserService } from "src/user/user.service";
import { UserServiceInterface } from "src/user/interface/user.service.interface";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [UserModule],
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