import { Test, TestingModule } from '@nestjs/testing';
import { UploadUseCasesInterface } from '../interface/upload.use-cases.interface';
import { UploadController } from '../upload.controller';
import { UploadService } from '../upload.service';
import { UploadServiceInterface } from '../interface/upload.service.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as XLSX from 'xlsx';

describe('UploadService', () => {
    let uploadService: UploadServiceInterface;
    let uploadUseCase: UploadUseCasesInterface;

    const validMockFile: Express.Multer.File = {
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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UploadController],
            providers: [
                {
                    provide: UploadServiceInterface,
                    useClass: UploadService
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

    describe('uploadXlsx', () => {
        it('deve retornar sucesso', async () => {
            const result = await uploadService.uploadXlsx(validMockFile);

            expect(uploadUseCase.insertUsers).toHaveBeenCalled();
            expect(uploadUseCase.removeDuplicateRecords).toHaveBeenCalled();
            expect(result).toEqual({sucess: true, message: 'Arquivo inserido com sucesso'});
        });

        it('deve lançar um erro ao inserir usuários', async () => {
            jest.spyOn(uploadUseCase, 'removeDuplicateRecords').mockImplementation();
            jest.spyOn(uploadUseCase, 'insertUsers').mockRejectedValue(new Error('Erro ao inserir usuários'));
        
            await expect(uploadService.uploadXlsx(validMockFile))
                .rejects
                .toThrowError('Erro ao inserir usuários');
        
            expect(uploadUseCase.insertUsers).toHaveBeenCalledWith(expect.any(Array));
        });   
        
        it('deve remover registros duplicados antes de inserir', async () => {
            jest.spyOn(uploadUseCase, 'removeDuplicateRecords').mockImplementation();
            jest.spyOn(uploadUseCase, 'insertUsers').mockResolvedValue();
        
            await uploadService.uploadXlsx(validMockFile);
        
            expect(uploadUseCase.removeDuplicateRecords).toHaveBeenCalledWith([], "email");
        });

        it('deve retornar sucesso mesmo com dados vazios', async () => {
            const emptyMockData: CreateUserDto[] = [];

            jest.spyOn(uploadUseCase, 'removeDuplicateRecords').mockImplementation();
            jest.spyOn(uploadUseCase, 'insertUsers').mockResolvedValue();
        
            const result = await uploadService.uploadXlsx(validMockFile);
        
            expect(result).toEqual({
                sucess: true,
                message: 'Arquivo inserido com sucesso',
            });
            expect(uploadUseCase.insertUsers).toHaveBeenCalledWith(emptyMockData);
        });
    })

    describe('createSheetFromData', () => {    
        it('deve criar um worksheet válido a partir de um arquivo Excel válido', () => {
            const mockBuffer = Buffer.from('mock Excel data');
            const mockFile: Express.Multer.File = {
                fieldname: 'file',
                originalname: 'mock-file.xlsx',
                encoding: '7bit',
                mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                buffer: mockBuffer,
                size: 12345,
                stream: null,
                destination: '',
                filename: 'mock-file.xlsx',
                path: '',
            };
        
            const mockWorksheet = { A1: { v: 'Header' }, A2: { v: 'Data' } }; 
            const mockWorkbook = {
                SheetNames: ['Sheet1'],
                Sheets: {
                    Sheet1: mockWorksheet,
                },
            };
        
            jest.spyOn(XLSX, 'read').mockReturnValue(mockWorkbook);
        
            const result = uploadService['createSheetFromData'](mockFile);
        
            expect(result).toEqual(mockWorksheet);
        });

        it('deve lançar um erro se o buffer do arquivo for inválido', () => {
            const mockFile: Express.Multer.File = {
                fieldname: 'file',
                originalname: 'mock-file.xlsx',
                encoding: '7bit',
                mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                buffer: Buffer.from('invalid data'),
                size: 12345,
                stream: null,
                destination: '',
                filename: 'mock-file.xlsx',
                path: '',
            };
        
            jest.spyOn(XLSX, 'read').mockImplementation(() => {
                throw new Error('Erro ao ler o arquivo');
            });
        
            expect(() => uploadService['createSheetFromData'](mockFile))
                .toThrowError('Erro ao ler o arquivo');
        });

        it('deve retornar o primeiro worksheet corretamente quando há múltiplos sheets', () => {
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
        
            const mockWorksheet1 = { A1: { v: 'Sheet1 Header' } };
            const mockWorksheet2 = { A1: { v: 'Sheet2 Header' } };
        
            const mockWorkbook = {
                SheetNames: ['Sheet1', 'Sheet2'],
                Sheets: {
                    Sheet1: mockWorksheet1,
                    Sheet2: mockWorksheet2,
                },
            };
        
            jest.spyOn(XLSX, 'read').mockReturnValue(mockWorkbook);
        
            const result = uploadService['createSheetFromData'](mockFile);
        
            expect(result).toEqual(mockWorksheet1); 
        });
    })

    describe('uploadTxt', () => {
        const mockTxtFile: Express.Multer.File = {
          fieldname: 'file',
          originalname: 'mock-file.txt',
          encoding: '7bit',
          mimetype: 'text/plain',
          buffer: Buffer.from('João;Silva;joao.silva@example.com\nMaria;Santos;maria.santos@example.com'),
          size: 1024,
          stream: null,
          destination: '',
          filename: 'mock-file.txt',
          path: '',
        };
      
        it('deve processar e inserir registros corretamente a partir de um arquivo válido', async () => {
          jest.spyOn(uploadUseCase, 'removeDuplicateRecords').mockImplementation();
          jest.spyOn(uploadUseCase, 'insertUsers').mockResolvedValue();
      
          const result = await uploadService.uploadTxt(mockTxtFile);
      
          expect(uploadUseCase.removeDuplicateRecords).toHaveBeenCalledWith(expect.any(Array), 'email');
          expect(uploadUseCase.insertUsers).toHaveBeenCalledWith(expect.any(Array));
          expect(result).toEqual({
            sucess: true,
            message: 'Arquivo inserido com sucesso',
          });
        });
      
        it('deve lançar um erro ao tentar inserir usuários inválidos', async () => {
          jest.spyOn(uploadUseCase, 'removeDuplicateRecords').mockImplementation();
          jest.spyOn(uploadUseCase, 'insertUsers').mockRejectedValue(new Error('Erro ao inserir usuários'));
      
          await expect(uploadService.uploadTxt(mockTxtFile)).rejects.toThrowError('Erro ao inserir usuários');
        });
      
        it('deve retornar sucesso mesmo se o arquivo não contiver linhas duplicadas', async () => {
          const mockBuffer = Buffer.from('João;Silva;joao.silva@example.com\nMaria;Santos;maria.santos@example.com');
          const file = { ...mockTxtFile, buffer: mockBuffer };
      
          jest.spyOn(uploadUseCase, 'removeDuplicateRecords').mockImplementation();
          jest.spyOn(uploadUseCase, 'insertUsers').mockResolvedValue();
      
          const result = await uploadService.uploadTxt(file);
      
          expect(uploadUseCase.removeDuplicateRecords).toHaveBeenCalledWith(expect.any(Array), 'email');
          expect(result).toEqual({
            sucess: true,
            message: 'Arquivo inserido com sucesso',
          });
        });
    });   
    
    describe('processFileTxt', () => {
        it('deve processar corretamente um buffer contendo linhas válidas', () => {
          const mockBuffer = Buffer.from('João;Silva;joao.silva@example.com\nMaria;Santos;maria.santos@example.com');
      
          const result = uploadService['processFileTxt'](mockBuffer);
      
          expect(result).toEqual([
            { name: 'João', surname: 'Silva', email: 'joao.silva@example.com' },
            { name: 'Maria', surname: 'Santos', email: 'maria.santos@example.com' },
          ]);
        });
      
        it('deve preencher campos ausentes com strings vazias', () => {
          const mockBuffer = Buffer.from('João;;joao.silva@example.com\nMaria;Santos;');
      
          const result = uploadService['processFileTxt'](mockBuffer);
      
          expect(result).toEqual([
            { name: 'João', surname: '', email: 'joao.silva@example.com' },
            { name: 'Maria', surname: 'Santos', email: '' },
          ]);
        });
      
        it('deve retornar um array vazio se o buffer estiver vazio', () => {
          const mockBuffer = Buffer.from('');
      
          const result = uploadService['processFileTxt'](mockBuffer);
      
          expect(result).toEqual([]);
        });
    });      
})