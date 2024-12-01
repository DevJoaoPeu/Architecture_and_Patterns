import { CreateUserDto } from "src/user/dto/create-user.dto";
import { IReturnFile } from "./upload.interface";

export abstract class UploadServiceInterface {
    abstract uploadXlsx(file: Express.Multer.File): Promise<IReturnFile>;
}

