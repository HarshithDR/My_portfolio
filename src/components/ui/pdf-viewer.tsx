'use client';

import React from 'react';

interface PdfViewerProps {
  file: string; // The path to the PDF file (e.g., "/resume.pdf")
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
  // Ensure the file path starts with a slash if it's relative to the public folder
  const pdfSrc = file.startsWith('/') ? file : `/${file}`;

  return (
    <embed
      // Removed #toolbar=0&navpanes=0&scrollbar=0 for broader compatibility
      src={pdfSrc}
      type="application/pdf"
      className="w-full h-full border-none" // Ensure it fills container and has no border
    />
  );
};

export default PdfViewer;