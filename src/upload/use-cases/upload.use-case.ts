import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UploadUseCasesInterface } from "../interface/upload.use-cases.interface";
import { UserServiceInterface } from "../../user/interface/user.service.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UploadUseCase implements UploadUseCasesInterface {
    constructor(
        private readonly userService: UserServiceInterface
    ) {}

    async insertUsers(data: CreateUserDto[]): Promise<void> {
        const batchSize = 1000;

        for (let i = 0; i < data.length; i += batchSize) {
          const batch: CreateUserDto[] = data.slice(i, i + batchSize);
          await this.userService.createMany(batch);
        }
    }

    removeDuplicateRecords<T, K extends keyof T>(data: T[], uniqueKey: K): T[]  {
        const uniqueValues = new Set<T[K]>();
  
        return data.filter(record => {
          const value = record[uniqueKey];
          if (uniqueValues.has(value)) {
            return false;
          }
          uniqueValues.add(value);
          return true;
        });
    }
}