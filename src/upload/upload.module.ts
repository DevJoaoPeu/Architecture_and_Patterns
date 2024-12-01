import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { UploadServiceInterface } from "./interface/upload.service.interface";
import { UserService } from "src/user/user.service";
import { UserServiceInterface } from "src/user/interface/user.service.interface";
import { UserModule } from "src/user/user.module";
import { UploadUseCasesInterface } from "./interface/upload.use-cases.interface";
import { UploadUseCase } from "./use-cases/upload.use-case";

@Module({
    imports: [UserModule],
    controllers: [UploadController],
    providers: [
        {
            provide: UploadServiceInterface,
            useClass: UploadService
        },
        {
            provide: UploadUseCasesInterface,
            useClass: UploadUseCase
        }
    ],
    exports: []
})
export class UploadModule {}