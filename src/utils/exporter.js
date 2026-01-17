import html2pdf from 'html2pdf.js';
import TurndownService from 'turndown';
import { saveAs } from 'file-saver';

export const exportNote = async (format, title, content) => {
  const filename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note';
  
  switch (format) {
    case 'pdf':
      await exportPDF(title, content, filename);
      break;
    case 'md':
      exportMarkdown(title, content, filename);
      break;
    case 'txt':
      exportText(title, content, filename);
      break;
    case 'docx':
      exportDocx(title, content, filename);
      break;
    default:
      console.error('Unknown format');
  }
};

const exportPDF = (title, content, filename) => {
  // Create a wrapper to add styling for the PDF
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h1 style="border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">${title}</h1>
      <div style="line-height: 1.6;">${content}</div>
    </div>
  `;

  const opt = {
    margin:       10,
    filename:     `${filename}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};

const exportMarkdown = (title, content, filename) => {
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(content);
  const blob = new Blob([`# ${title}\n\n${markdown}`], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${filename}.md`);
};

const exportText = (title, content, filename) => {
  // Create a temporary element to strip HTML
  const tmp = document.createElement('DIV');
  tmp.innerHTML = content;
  const text = tmp.textContent || tmp.innerText || '';
  const blob = new Blob([`${title}\n\n${text}`], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${filename}.txt`);
};

const exportDocx = (title, content, filename) => {
  // Simple HTML export that Word opens happily
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
                        xmlns:w='urn:schemas-microsoft-com:office:word' 
                        xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${title}</title></head><body>`;
  const footer = "</body></html>";
  const sourceHTML = header + `<h1>${title}</h1>` + content + footer;

  const blob = new Blob(['\ufeff', sourceHTML], { 
    type: 'application/msword' 
  });
  saveAs(blob, `${filename}.doc`);
};
