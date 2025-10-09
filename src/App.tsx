import type { JSX } from 'react';
import { PDFViewer } from '@presentation/components/PDFViewer';

function App(): JSX.Element {
  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">PDF Annotator</h1>
      <PDFViewer fileUrl="/dummy.pdf" />
    </div>
  );
}

export default App;
