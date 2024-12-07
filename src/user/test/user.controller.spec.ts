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

    describe('create', () => {        
        it('deve criar um novo usuário', async () => {
            const user = { name: 'John Doe', email: 'QK2tM@example.com', surname: 'Doe', createdAt: new Date(), updatedAt: new Date() }
            const result = await userController.create(user);

            jest.spyOn(userService, 'createMany').mockResolvedValue();
            
            expect(result).toEqual(undefined);
        });
    })

    describe('createMany', () => {
        it('deve criar vários usuários', async () => {
            const users = [
                { name: 'John Doe', email: 'QK2tM@example.com', surname: 'Doe', createdAt: new Date(), updatedAt: new Date() },
                { name: 'John Doe', email: 'kajskd@example.com', surname: 'Doe', createdAt: new Date(), updatedAt: new Date() }
            ]

            jest.spyOn(userService, 'createMany').mockResolvedValue();

            const result = await userController.createMany(users);
            expect(userService.createMany).toHaveBeenCalledWith(users);
            expect(result).toEqual(undefined);
        });
    })
})