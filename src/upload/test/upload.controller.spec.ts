import { Test, TestingModule } from '@nestjs/testing';
import { UploadServiceInterface } from "../interface/upload.service.interface"
import { UploadController } from '../upload.controller';

describe('UploadController', () => {
    let uploadController: UploadController;
    let uploadService: UploadServiceInterface;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UploadController],
            providers: [
                {
                    provide: UploadServiceInterface,
                    useValue: {
                        uploadXlsx: jest.fn()
                    }
                }
            ],
        }).compile();

        uploadController = module.get<UploadController>(UploadController);
        uploadService = module.get<UploadServiceInterface>(UploadServiceInterface);
    })

    it('should be defined', () => {
        expect(uploadController).toBeDefined();
    });
})