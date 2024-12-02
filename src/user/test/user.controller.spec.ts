import { Test, TestingModule } from "@nestjs/testing";
import { UserServiceInterface } from "../interface/user.service.interface";
import { UserController } from "../user.controller";

describe('UploadController', () => {
    let userController: UserController;
    let userService: UserServiceInterface   

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserServiceInterface,
                    useValue: {
                        create: jest.fn(),
                        createMany: jest.fn()
                    }
                }
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserServiceInterface>(UserServiceInterface);
    })

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });
})