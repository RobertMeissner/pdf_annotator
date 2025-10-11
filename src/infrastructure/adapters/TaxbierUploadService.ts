import type { IPDFUploadService, UploadResult } from '@domain/ports/IPDFUploadService.ts';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface UploadResponse {
  file_id?: string;
  message?: string;
}

export class TaxbierUploadService implements IPDFUploadService {
  private readonly baseUrl = '/api'; // better in .env?

  async getToken(email: string): Promise<string> {
    const url = `${this.baseUrl}/provide-token?email=${encodeURIComponent(email)}`;
    const options = { method: 'POST' };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status.toString()}: ${response.statusText}`);
      }
      const data = (await response.json()) as TokenResponse;
      return data.access_token;
    } catch (error) {
      console.error('getToken: ', error);
      throw error;
    }
  }

  async uploadPDF(file: File, token: string): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseUrl}/upload-pdf`;

    try {
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status.toString()}: ${response.statusText}`);
      }

      const data = (await response.json()) as UploadResponse;
      return { success: true, message: 'PDF upload successful', fileId: data.file_id };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during upload.';
      return new (class implements UploadResult {
        message = 'Upload failed';
        success = false;
        error = errorMessage;
      })();
    }
  }
}
