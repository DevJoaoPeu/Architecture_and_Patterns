import { Injectable } from "@nestjs/common";

@Injectable()
export class UploadService {
    upload_xlsx(file: any) {
        console.log(file)
    }
}