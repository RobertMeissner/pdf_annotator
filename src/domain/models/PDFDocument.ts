/**
 * Domain Model: PDFDocument
 *
 * Represents a PDF document in the system.
 * Value object - immutable after creation.
 */

export interface PageDimensions {
  width: number;
  height: number;
}

export interface PageInfo {
  pageNumber: number; // 1-indexed
  dimensions: PageDimensions;
}

export interface PDFDocument {
  id: string;
  filename: string;
  fileSize: number; // bytes
  mimeType: string; // should always be 'application/pdf'
  totalPages: number;
  pages: PageInfo[];
  uploadedAt: Date;
  userId?: string; // Optional: for when auth is implemented
}