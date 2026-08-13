import jsPDF from 'jspdf';
import { NoteItem } from '../types';

export const generateNotePDF = (note: NoteItem): { doc: jsPDF; filename: string } => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header Background Bar (Navy Blue)
  doc.setFillColor(15, 23, 42); // #0F172A
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Gold Accent Stripe
  doc.setFillColor(248, 157, 42); // #F89D2A
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TOMATO OFFICIAL', margin, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(254, 202, 202);
  doc.text('Official Learning Portal & Educator PDF Material', margin, 20);

  // Status Badge on Right
  doc.setFillColor(248, 157, 42);
  doc.roundedRect(pageWidth - margin - 35, 8, 35, 12, 2, 2, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('UNLOCKED PDF', pageWidth - margin - 32, 15);

  let currentY = 38;

  // Note Meta Section
  doc.setFillColor(241, 245, 249); // light slate
  doc.roundedRect(margin, currentY, contentWidth, 22, 3, 3, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`SUBJECT: ${note.subject.toUpperCase()}  |  CLASS: ${note.grade.toUpperCase()}`, margin + 5, currentY + 7);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(note.title, margin + 5, currentY + 16);

  currentY += 28;

  // Decorative Chapter Tag
  if (note.chapter) {
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(`Chapter: ${note.chapter}`, margin, currentY);
    currentY += 6;
  }

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // AI Summary Box if available
  if (note.aiSummary) {
    doc.setFillColor(238, 242, 255); // soft blue-indigo
    doc.setDrawColor(199, 210, 254);
    doc.roundedRect(margin, currentY, contentWidth, 26, 3, 3, 'FD');

    doc.setTextColor(30, 58, 138);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('✨ AI Guru Executive Summary & Key Exam Tips', margin + 5, currentY + 6);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const splitSummary = doc.splitTextToSize(note.aiSummary.summary, contentWidth - 10);
    doc.text(splitSummary.slice(0, 3), margin + 5, currentY + 12);

    currentY += 32;
  }

  // Main Note Content
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Notes & Concepts:', margin, currentY);
  currentY += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const cleanContent = note.content.replace(/#/g, '').replace(/\*/g, '•');
  const splitLines = doc.splitTextToSize(cleanContent, contentWidth);

  for (let i = 0; i < splitLines.length; i++) {
    if (currentY > pageHeight - 20) {
      doc.addPage();
      currentY = 20;
      
      // Footer page count
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Tomato Official Study Vault - Page 2', margin, pageHeight - 10);
    }
    doc.text(splitLines[i], margin, currentY);
    currentY += 5;
  }

  currentY += 5;

  // Key Formulas or Terms if available
  if (note.aiSummary?.keyFormulasOrTerms && note.aiSummary.keyFormulasOrTerms.length > 0) {
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('🔑 Key Formulas & Definitions:', margin, currentY);
    currentY += 6;

    note.aiSummary.keyFormulasOrTerms.forEach((item) => {
      if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 83, 9); // amber 700
      doc.text(`• ${item.term}: `, margin + 3, currentY);
      
      const termWidth = doc.getTextWidth(`• ${item.term}: `);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const splitDef = doc.splitTextToSize(item.definition, contentWidth - termWidth - 5);
      doc.text(splitDef, margin + 3 + termWidth, currentY);
      currentY += (splitDef.length * 4.5) + 2;
    });
  }

  // Watermark Footer on First Page
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Downloaded from Tomato Official Vault on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, margin, pageHeight - 10);
  doc.text('Confidential Student Revision Material', pageWidth - margin - 55, pageHeight - 10);

  const cleanTitle = note.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `${note.subject}_${cleanTitle}_tomato_official.pdf`;

  return { doc, filename };
};

export const downloadNotePDFFile = (note: NoteItem): string => {
  const customPdf = note.customPdfUrl || note.fileAttachment?.dataUrl;
  if (customPdf && (customPdf.startsWith('data:') || customPdf.startsWith('blob:'))) {
    const cleanTitle = note.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const fileName = note.fileAttachment?.name || `${note.subject}_${cleanTitle}_uploaded.pdf`;
    
    const link = document.createElement('a');
    link.href = customPdf;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return fileName;
  }

  const { doc, filename } = generateNotePDF(note);
  doc.save(filename);
  return filename;
};
