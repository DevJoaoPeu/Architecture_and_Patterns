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
                    useClass: UserService
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

    describe('create', () => {
        it('should save a user and return the created entity', async () => {
            const user = { name: 'John Doe', email: 'john@example.com' } as any;
            const savedUser = { id: 1, ...user } as UserEntity;

            jest.spyOn(repository, 'save').mockResolvedValue(savedUser);

            const result = await userService.create(user);

            expect(repository.save).toHaveBeenCalledWith(user);
            expect(result).toEqual(savedUser);
        });

        it('should throw an error if save fails', async () => {
            const user = { name: 'John Doe', email: 'john@example.com' } as any;

            jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));

            await expect(userService.create(user)).rejects.toThrow('Database error');
            expect(repository.save).toHaveBeenCalledWith(user);
        });
    });

    describe('createMany', () => {
        it('should save multiple users in chunks', async () => {
            const users = [
                { name: 'John Doe', email: 'john@example.com' },
                { name: 'Jane Doe', email: 'jane@example.com' }
            ] as any[];

            jest.spyOn(repository, 'save').mockResolvedValue(undefined);

            await userService.createMany(users);

            expect(repository.save).toHaveBeenCalledWith(users, { chunk: 1000 });
        });

        it('should throw an error if saving multiple users fails', async () => {
            const users = [
                { name: 'John Doe', email: 'john@example.com' },
                { name: 'Jane Doe', email: 'jane@example.com' }
            ] as any[];

            jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));

            await expect(userService.createMany(users)).rejects.toThrow('Database error');
            expect(repository.save).toHaveBeenCalledWith(users, { chunk: 1000 });
        });

        it('should log an error if saving fails', async () => {
            const users = [
                { name: 'John Doe', email: 'john@example.com' },
                { name: 'Jane Doe', email: 'jane@example.com' }
            ] as any[];

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));

            await expect(userService.createMany(users)).rejects.toThrow('Database error');
            expect(consoleSpy).toHaveBeenCalledWith('Erro ao inserir usuários:', expect.any(Error));

            consoleSpy.mockRestore();
        });
    });
})