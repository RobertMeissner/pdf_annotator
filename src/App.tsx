import React, { type JSX, useState } from 'react';
import { PDFViewer } from '@presentation/components/PDFViewer';
import type { DrawAnnotation } from '@domain/models/Annotation.ts';
import type { DrawingMode } from '@presentation/types.ts';
import { AnnotationLayer } from '@presentation/components/AnnotationLayer.tsx';
import { Container } from '@infrastructure/di/Container.ts';
import { toast, Toaster } from 'sonner';

function App(): JSX.Element {
  // state
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allAnnotations, setAllAnnotations] = useState<DrawAnnotation[]>([]);
  const [mode, setMode] = useState<DrawingMode>('draw');

  const [email, setEmail] = useState<string>('robert.meissner.ai@gmail.com');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // handlers
  function handleDocumentLoad(totalPages: number): void {
    setNumPages(totalPages);
  }

  function handleChangedPage(page: number): void {
    setCurrentPage(page);
  }

  function handleAnnotationCreate(annotation: DrawAnnotation): void {
    setAllAnnotations((prev) => [...prev, annotation]);
  }

  function handleAnnotationDelete(annotationId: string): void {
    setAllAnnotations((prev) => prev.filter((a) => a.id !== annotationId));
  }

  function handleDeleteCurrentPage(): void {
    setAllAnnotations((prev) => prev.filter((a) => a.pageNumber !== currentPage));
  }

  function handleDeleteAllPages(): void {
    setAllAnnotations([]);
  }

  async function handleUploadPDF(): Promise<void> {
    if (!email.trim() || !pdfFile) return;

    setIsUploading(true);

    try {
      const uploadUseCase = Container.getUploadUseCase();

      const result = await uploadUseCase.execute(pdfFile, email);
      if (result.success) {
        toast.success('PDF upload successful.');
      } else {
        toast.error('PDF upload not successful.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setFileName(file.name);
      // reset annotations when loading new file
      setAllAnnotations([]);
    }
  }

  function handleClearFile(): void {
    setPdfFile(null);
    setFileName('');
    handleDeleteAllPages();
    setCurrentPage(1);
    setNumPages(0);
  }

  // Filter annotations for current page
  const currentPageAnnotations = allAnnotations.filter((a) => a.pageNumber === currentPage);

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <h1 className="text-3xl font-bold mb-4 text-gray-900">PDF Annotator</h1>
      {/* File Management */}
      {pdfFile && (
        <div className="w-full max-w-4xl flex items-center gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">File:</span>
            <span className="text-sm text-gray-900">{fileName}</span>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <input
            type="email"
            placeholder="e-mail"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            className="px-3 py-2 border border-b-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={() => void handleUploadPDF()}
            disabled={isUploading || !email.trim() || !pdfFile}
            className="w-24 px-4 py-2 bg-green-600 text-white border border-green-700 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Upload pdf to cloud."
          >
            {isUploading ? 'Uploading …' : 'Upload'}
          </button>

          <div className="h-6 w-px bg-gray-300"></div>

          <button
            onClick={handleClearFile}
            className="h-10 px-4 py-2 bg-white text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Reset to select a different PDF file"
          >
            Reset file selection
          </button>
        </div>
      )}

      {/* Annotation Controls */}

      <div className="w-full max-w-4xl flex items-center gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode('draw');
            }}
            className={`w-24 px-4 py-2 border rounded transition-colors ${
              mode === 'draw'
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title="Draw annotation free handed"
          >
            Draw
          </button>
          <button
            onClick={() => {
              setMode('select');
            }}
            className={`w-24 px-4 py-2 border rounded transition-colors ${
              mode === 'select'
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title="Erase annotation by clicking on it"
          >
            Erase
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <div className="flex gap-2">
          <button
            onClick={handleDeleteCurrentPage}
            disabled={currentPageAnnotations.length === 0}
            className="w-24 px-4 py-2 bg-white text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Clear annotations on this page only."
          >
            Clear
          </button>
          <button
            onClick={handleDeleteAllPages}
            disabled={allAnnotations.length === 0}
            className="w-24 px-4 py-2 bg-white text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Clear all annotations on all pages."
          >
            Reset
          </button>
        </div>

        <span className="ml-auto text-sm text-gray-500">
          {currentPageAnnotations.length} annotation(s) on this page
        </span>
      </div>
      {!pdfFile ? (
        <div className="w-full max-w-4xl">
          <label
            htmlFor="pdf-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white │
     │ hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-lg font-semibold text-gray-700">Select PDF</p>
            </div>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <PDFViewer
          file={pdfFile}
          onDocumentLoad={handleDocumentLoad}
          currentPage={currentPage}
          totalPages={numPages}
          setCurrentPage={handleChangedPage}
          pageWidth={pageWidth}
          setPageWidth={setPageWidth}
          pageHeight={pageHeight}
          setPageHeight={setPageHeight}
        >
          <AnnotationLayer
            width={pageWidth}
            height={pageHeight}
            documentId={fileName}
            pageNumber={currentPage}
            annotations={currentPageAnnotations}
            mode={mode}
            onAnnotationCreate={handleAnnotationCreate}
            onAnnotationDelete={handleAnnotationDelete}
          />
        </PDFViewer>
      )}
    </div>
  );
}

export default App;
