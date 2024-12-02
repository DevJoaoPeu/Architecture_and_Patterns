import { Test, TestingModule } from "@nestjs/testing";
import { UserServiceInterface } from "../interface/user.service.interface";
import { UserService } from "../user.service";
import { UserEntity } from "../entity/user.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('UserService', () => {
    let userService: UserServiceInterface;
    let repository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: UserServiceInterface,
                    useValue: UserService
                },
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        save: jest.fn()
                    }
                }
            ],
        }).compile();

        userService = module.get<UserServiceInterface>(UserServiceInterface);
        repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    })

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });
})