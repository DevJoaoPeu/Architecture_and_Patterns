import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserServiceInterface } from "../../user/interface/user.service.interface";
import { UploadServiceInterface } from "../interface/upload.service.interface";
import { UploadUseCasesInterface } from "../interface/upload.use-cases.interface";
import { UploadController } from "../upload.controller";
import { UploadUseCase } from "../use-cases/upload.use-case";
import { Test, TestingModule } from "@nestjs/testing";

describe('UploadUseCases', () => {
    let uploadUseCase: UploadUseCasesInterface;
    let userService: UserServiceInterface;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UploadController],
            providers: [
                {
                    provide: UploadServiceInterface,
                    useValue: {
                        uploadXlsx: jest.fn()
                    }
                },
                {
                    provide: UploadUseCasesInterface,
                    useClass: UploadUseCase
                },
                {
                    provide: UserServiceInterface,
                    useValue: {
                        create: jest.fn(),
                        createMany: jest.fn()
                    }
                }
            ],
        }).compile();

        uploadUseCase = module.get<UploadUseCasesInterface>(UploadUseCasesInterface);
        userService = module.get<UserServiceInterface>(UserServiceInterface);
    })

    it('should be defined', () => {
        expect(uploadUseCase).toBeDefined();
    });

    describe('insertUsers', () => {
        it('deve retornar sucesso', async () => {
            const mockedData = [
                {
                    name: 'John Doe',
                    email: 'QK2tM@example.com',
                    surname: 'Doe',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'John Doe',
                    email: 'kajskd@example.com',
                    surname: 'Doe',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]

            const result = await uploadUseCase.insertUsers(mockedData);

            expect(result).toEqual(undefined);
        });
    })

    describe('removeDuplicateRecords', () => {
        it('deve remover registros duplicados', () => {
            const result = uploadUseCase.removeDuplicateRecords([], 'email');
            expect(result).toEqual([]); 
        });
    })
})