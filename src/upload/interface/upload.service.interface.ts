
export abstract class UploadServiceInterface {
    abstract uploadXlsx(file: Express.Multer.File): Promise<void>;
}