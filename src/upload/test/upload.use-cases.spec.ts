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
                    useValue: UploadUseCase
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
})