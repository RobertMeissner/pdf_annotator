/**
 * PDFViewer Component
 *
 * Displays a PDF document using react-pdf.
 */

import React, { type JSX } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: File;
  onDocumentLoad: (numPages: number) => void;
  currentPage: number;
  totalPages: number;
  pageWidth: number;
  setPageWidth: (width: number) => void;
  pageHeight: number;
  setPageHeight: (height: number) => void;
  setCurrentPage: (page: number) => void;
  children: React.ReactNode;
}

export function PDFViewer({
  file,
  onDocumentLoad,
  currentPage,
  totalPages,
  pageWidth,
  setPageWidth,
  pageHeight,
  setPageHeight,
  setCurrentPage,
  children,
}: PDFViewerProps): JSX.Element {
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    onDocumentLoad(numPages);
  }

  function onPageLoadSuccess(page: { width: number; height: number }): void {
    setPageWidth(page.width);
    setPageHeight(page.height);
  }

  function goToPrevPage(): void {
    setCurrentPage(Math.max(currentPage - 1, 1));
  }

  function goToNextPage(): void {
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      {/* Navigation Controls */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
        <span className="ml-auto text-sm text-gray-500">
          Dimensions: {Math.round(pageWidth)} x {Math.round(pageHeight)}px
        </span>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex justify-center p-4">
        <div className="relative inline-block">
          <div className="relative z-0">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={currentPage} onLoadSuccess={onPageLoadSuccess} />
            </Document>
          </div>
          {pageWidth > 0 && pageHeight > 0 && (
            <div
              className="absolute top-0 left-0 z-10"
              style={{ width: pageWidth, height: pageHeight }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
