import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { UserServiceInterface } from "./interface/user.service.interface";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [
        {
            provide: UserServiceInterface,
            useClass: UserService
        }
    ],
    exports: [UserServiceInterface]
})
export class UserModule {}