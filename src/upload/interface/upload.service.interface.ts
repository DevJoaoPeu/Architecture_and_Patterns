import { IReturnFile } from "./upload.interface";

export abstract class UploadServiceInterface {
    abstract uploadXlsx(file: Express.Multer.File): Promise<IReturnFile>;
}

