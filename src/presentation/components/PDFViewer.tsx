/**
 * PDFViewer Component
 *
 * Displays a PDF document using react-pdf.
 */

import type { JSX } from 'react';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
}

export function PDFViewer({ fileUrl }: PDFViewerProps): JSX.Element {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function onPageLoadSuccess(page: { width: number; height: number }): void {
    setPageWidth(page.width);
    setPageHeight(page.height);
  }

  function goToPrevPage(): void {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  function goToNextPage(): void {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {numPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage >= numPages}
          className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
        <span className="ml-auto text-sm text-gray-500">
          Dimensions: {Math.round(pageWidth)} x {Math.round(pageHeight)}px
        </span>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-auto bg-white shadow-sm flex justify-center p-4">
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={currentPage} onLoadSuccess={onPageLoadSuccess} />
        </Document>
      </div>
    </div>
  );
}
