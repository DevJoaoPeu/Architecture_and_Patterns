import { Test, TestingModule } from '@nestjs/testing';
import { UploadServiceInterface } from "../interface/upload.service.interface"
import { UploadController } from '../upload.controller';
import { BadRequestException } from '@nestjs/common';

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

    describe('uploadXlsx', () => {
        it('deve retornar um error caso o arquivo nao seja enviado', () => {
            expect(() => uploadController.uploadXlsx(undefined))
                .toThrow(new BadRequestException('Arquivo é obrigatório'));
        });

        it('deve ser definido', async () => {
            const mockFile: Express.Multer.File = {
                fieldname: 'file',
                originalname: 'mock-file.xlsx',
                encoding: '7bit',
                mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                buffer: Buffer.from('mock Excel data'),
                size: 12345,
                stream: null, 
                destination: '',
                filename: 'mock-file.xlsx',
                path: '',
            };

            (uploadService.uploadXlsx as jest.Mock).mockResolvedValue({success: true, message: 'Arquivo inserido com sucesso'});

            const result = await uploadController.uploadXlsx(mockFile);

            expect(uploadService.uploadXlsx).toHaveBeenCalledWith(mockFile);
            expect(result).toEqual({
                success: true,
                message: 'Arquivo inserido com sucesso',
            });
        });
    })
})