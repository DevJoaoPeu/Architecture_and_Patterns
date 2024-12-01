import { Body, Controller, Post } from "@nestjs/common";
import { UserEntity } from "./entity/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserServiceInterface } from "./interface/user.service.interface";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserServiceInterface
    ) {}

    @Post('create')
    async create(@Body() body: CreateUserDto): Promise<UserEntity> {
        return this.userService.create(body)
    }

    @Post('createMany')
    async createMany(@Body() body: CreateUserDto[]): Promise<void> {
        return this.userService.createMany(body)
    }
}  