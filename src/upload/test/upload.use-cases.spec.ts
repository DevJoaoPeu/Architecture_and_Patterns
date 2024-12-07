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
        it('should return undefined when users are inserted successfully', async () => {
            const mockedData = [
                {
                    name: 'John Doe',
                    email: 'QK2tM@example.com',
                    surname: 'Doe',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: 'Jane Doe',
                    email: 'jane.doe@example.com',
                    surname: 'Doe',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            jest.spyOn(userService, 'createMany').mockResolvedValue(undefined);

            const result = await uploadUseCase.insertUsers(mockedData);

            expect(userService.createMany).toHaveBeenCalledWith(mockedData);
            expect(result).toBeUndefined();
        });

        it('should throw an error if userService.createMany fails', async () => {
            const mockedData = [
                {
                    name: 'John Doe',
                    email: 'QK2tM@example.com',
                    surname: 'Doe',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            jest.spyOn(userService, 'createMany').mockRejectedValue(new Error('Database error'));

            await expect(uploadUseCase.insertUsers(mockedData)).rejects.toThrow('Database error');
        });
    });

   describe('removeDuplicateRecords', () => {
        it('should remove duplicate records based on the specified field', () => {
            const mockedData = [
                { name: 'John Doe', email: 'QK2tM@example.com' },
                { name: 'Jane Doe', email: 'jane.doe@example.com' },
                { name: 'John Doe', email: 'QK2tM@example.com' },
            ];

            const result = uploadUseCase.removeDuplicateRecords(mockedData, 'email');

            expect(result).toEqual([
                { name: 'John Doe', email: 'QK2tM@example.com' },
                { name: 'Jane Doe', email: 'jane.doe@example.com' },
            ]);
        });

        it('should return the same array if there are no duplicates', () => {
            const mockedData = [
                { name: 'John Doe', email: 'QK2tM@example.com' },
                { name: 'Jane Doe', email: 'jane.doe@example.com' },
            ];

            const result = uploadUseCase.removeDuplicateRecords(mockedData, 'email');

            expect(result).toEqual(mockedData);
        });

        it('should return an empty array if the input array is empty', () => {
            const result = uploadUseCase.removeDuplicateRecords([], 'email');
            expect(result).toEqual([]);
        });
    });
})