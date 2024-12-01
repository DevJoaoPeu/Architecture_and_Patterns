import { CreateUserDto } from "src/user/dto/create-user.dto";

export abstract class UploadUseCasesInterface {
    abstract removeDuplicateRecords<T>(data: T[], uniqueKey: keyof T): T[];
    abstract insertUsers(data: CreateUserDto[]): Promise<void>
}