import { Injectable } from "@nestjs/common";
import { UserServiceInterface } from "./interface/user.interface";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService implements UserServiceInterface {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>   
    ) {} 

    create(user: CreateUserDto): Promise<UserEntity> {
        return this.repository.save(user)
    }

    async createMany(users: CreateUserDto[]): Promise<void> {
        try {
            await this.repository.save(users, { chunk: 1000 });
          } catch (error) {
            console.error('Erro ao inserir usuários:', error);
            throw error; 
          }
    }
}