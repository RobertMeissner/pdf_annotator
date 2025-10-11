import type { IPDFUploadService } from '@domain/ports/IPDFUploadService.ts';
import { TaxbierUploadService } from '@infrastructure/adapters/TaxbierUploadService.ts';
import { UploadPDFUseCase } from '@application/useCases/UploadPDFUseCase.ts';

let uploadServiceInstance: IPDFUploadService | null = null;

export const Container = {
  getUploadService(): IPDFUploadService {
    uploadServiceInstance ??= new TaxbierUploadService();
    return uploadServiceInstance;
  },
  getUploadUseCase(): UploadPDFUseCase {
    return new UploadPDFUseCase(this.getUploadService());
  },
};
