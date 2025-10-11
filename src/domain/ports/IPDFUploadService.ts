export interface UploadResult {
  success: boolean;
  message: string;
  fileId?: string;
  error?: string;
}

export interface IPDFUploadService {
  getToken(email: string): Promise<string>;
  uploadPDF(file: File, token: string): Promise<UploadResult>;
}
