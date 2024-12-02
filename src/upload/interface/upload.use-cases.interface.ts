import { CreateUserDto } from "src/user/dto/create-user.dto";

export abstract class UploadUseCasesInterface {
    abstract removeDuplicateRecords<T, K extends keyof T>(data: T[], uniqueKey: K): T[];
    abstract insertUsers(data: CreateUserDto[]): Promise<void>
}