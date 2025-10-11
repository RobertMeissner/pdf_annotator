import type { IPDFUploadService, UploadResult } from '@domain/ports/IPDFUploadService.ts';

export class UploadPDFUseCase {
  private uploadService: IPDFUploadService;

  constructor(uploadService: IPDFUploadService) {
    this.uploadService = uploadService;
  }

  async execute(file: File, email: string): Promise<UploadResult> {
    if (file.type !== 'application/pdf') {
      return { success: false, message: 'Only PDF allowed', error: 'Invalid file type' };
    }

    try {
      const token = await this.uploadService.getToken(email);
      return await this.uploadService.uploadPDF(file, token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during upload.';
      return { success: false, message: 'Upload failed', error: errorMessage };
    }
  }
}
