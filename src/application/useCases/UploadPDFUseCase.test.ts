/**
 * Tests for UploadPDFUseCase
 *
 * Testing application layer business logic with mocked infrastructure.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UploadPDFUseCase } from './UploadPDFUseCase';
import type { IPDFUploadService, UploadResult } from '@domain/ports/IPDFUploadService';

// Mock PDF Upload Service
class MockPDFUploadService implements IPDFUploadService {
  public getTokenCalled = false;
  public uploadPDFCalled = false;
  public shouldFailToken = false;
  public shouldFailUpload = false;

  async getToken(email: string): Promise<string> {
    this.getTokenCalled = true;
    if (this.shouldFailToken) {
      throw new Error('Token generation failed');
    }
    return Promise.resolve(`token-for-${email}`);
  }

  async uploadPDF(_file: File, _token: string): Promise<UploadResult> {
    this.uploadPDFCalled = true;
    if (this.shouldFailUpload) {
      return Promise.resolve({
        success: false,
        message: 'Upload failed',
        error: 'Network error',
      });
    }
    return Promise.resolve({
      success: true,
      message: 'Upload successful',
      fileId: 'file-123',
    });
  }
}

describe('UploadPDFUseCase', () => {
  let mockService: MockPDFUploadService;
  let useCase: UploadPDFUseCase;
  let pdfFile: File;

  beforeEach(() => {
    mockService = new MockPDFUploadService();
    useCase = new UploadPDFUseCase(mockService);

    // Create a mock PDF file
    pdfFile = new File(['dummy pdf content'], 'test.pdf', { type: 'application/pdf' });
  });

  describe('File Type Validation', () => {
    it('should reject non-PDF files', async () => {
      const txtFile = new File(['text content'], 'test.txt', { type: 'text/plain' });

      const result = await useCase.execute(txtFile, 'test@example.com');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid file type');
    });

    it('should accept PDF files', async () => {
      const result = await useCase.execute(pdfFile, 'test@example.com');
      expect(result.success).toBe(true);
    });
  });

  describe('Successful Upload Flow', () => {
    it('should get token and upload PDF successfully', async () => {
      const result = await useCase.execute(pdfFile, 'test@example.com');

      expect(result.success).toBe(true);
      expect(result.fileId).toBe('file-123');
      expect(mockService.getTokenCalled).toBe(true);
      expect(mockService.uploadPDFCalled).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle token generation failure', async () => {
      mockService.shouldFailToken = true;

      const result = await useCase.execute(pdfFile, 'test@example.com');

      expect(result.success).toBe(false);
      expect(mockService.getTokenCalled).toBe(true);
      expect(mockService.uploadPDFCalled).toBe(false);
    });

    it('should handle upload failure', async () => {
      mockService.shouldFailUpload = true;

      const result = await useCase.execute(pdfFile, 'test@example.com');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Upload failed');
      expect(result.error).toBe('Network error');
      expect(mockService.getTokenCalled).toBe(true);
      expect(mockService.uploadPDFCalled).toBe(true);
    });

    it('should handle unknown errors gracefully', async () => {
      // Simulate throwing non-Error object
      mockService.getToken = () => {
        throw 'String error'; // eslint-disable-line @typescript-eslint/only-throw-error
      };

      const result = await useCase.execute(pdfFile, 'test@example.com');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Upload failed');
      expect(result.error).toBe('Unknown error during upload.');
    });
  });
});
