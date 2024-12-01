import { CreateUserDto } from "../dto/create-user.dto";
import { UserEntity } from "../entity/user.entity";

export abstract class UserServiceInterface {
    abstract create(user: UserEntity): Promise<UserEntity>;
    abstract createMany(users: CreateUserDto[]): Promise<void>;
}