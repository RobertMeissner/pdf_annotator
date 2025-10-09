import { type JSX, useState } from 'react';
import { PDFViewer } from '@presentation/components/PDFViewer';
import type { DrawAnnotation } from '@domain/models/Annotation.ts';
import type { DrawingMode } from '@presentation/types.ts';
import { AnnotationLayer } from '@presentation/components/AnnotationLayer.tsx';

function App(): JSX.Element {
  // state
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allAnnotations, setAllAnnotations] = useState<DrawAnnotation[]>([]);
  const [mode, setMode] = useState<DrawingMode>('draw');
  const fileUrl = '/dummy.pdf';

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

  // Filter annotations for current page
  const currentPageAnnotations = allAnnotations.filter((a) => a.pageNumber === currentPage);

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">PDF Annotator</h1>
      {/* Annotation Controls */}

      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode('draw');
            }}
            className={`px-4 py-2 border rounded transition-colors ${
              mode === 'draw'
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            ✏️ Draw
          </button>
          <button
            onClick={() => {
              setMode('select');
            }}
            className={`px-4 py-2 border rounded transition-colors ${
              mode === 'select'
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            🎯 Select
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <div className="flex gap-2">
          <button
            onClick={handleDeleteCurrentPage}
            disabled={currentPageAnnotations.length === 0}
            className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            🗑️ Clear Page
          </button>
          <button
            onClick={handleDeleteAllPages}
            disabled={allAnnotations.length === 0}
            className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            🗑️ Clear All
          </button>
        </div>

        <span className="ml-auto text-sm text-gray-500">
          {currentPageAnnotations.length} annotation(s) on this page
        </span>
      </div>
      <PDFViewer
        fileUrl={fileUrl}
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
          documentId={fileUrl}
          pageNumber={currentPage}
          annotations={currentPageAnnotations}
          mode={mode}
          onAnnotationCreate={handleAnnotationCreate}
          onAnnotationDelete={handleAnnotationDelete}
        />
      </PDFViewer>
    </div>
  );
}

export default App;
