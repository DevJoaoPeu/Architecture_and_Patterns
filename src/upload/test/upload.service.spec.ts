import { Test, TestingModule } from '@nestjs/testing';
import { UploadUseCasesInterface } from '../interface/upload.use-cases.interface';
import { UploadController } from '../upload.controller';
import { UploadService } from '../upload.service';
import { UploadServiceInterface } from '../interface/upload.service.interface';

describe('UploadService', () => {
    let uploadService: UploadServiceInterface;
    let uploadUseCase: UploadUseCasesInterface;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UploadController],
            providers: [
                {
                    provide: UploadServiceInterface,
                    useValue: UploadService
                },
                {
                    provide: UploadUseCasesInterface,
                    useValue: {
                        insertUsers: jest.fn(),
                        removeDuplicateRecords: jest.fn()
                    }
                }
            ],
        }).compile();

        uploadService = module.get<UploadServiceInterface>(UploadServiceInterface);
        uploadUseCase = module.get<UploadUseCasesInterface>(UploadUseCasesInterface);
    })

    it('should be defined', () => {
        expect(uploadService).toBeDefined();
    });
})