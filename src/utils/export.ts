/**
 * Export utilities for ImpactSoluce reports and data
 */

export interface ExportData {
  [key: string]: any;
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: ExportData, filename: string = 'impactsoluce-export.json'): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download data as Markdown file
 */
export function downloadMarkdown(data: ExportData, filename: string = 'impactsoluce-export.md'): void {
  let markdown = '# ImpactSoluce ESG Report\n\n';
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  
  // Convert data to markdown format
  const convertToMarkdown = (obj: any, level: number = 1): string => {
    let md = '';
    for (const [key, value] of Object.entries(obj)) {
      const headerPrefix = '#'.repeat(level);
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        md += `${headerPrefix} ${key}\n\n`;
        md += convertToMarkdown(value, level + 1);
      } else if (Array.isArray(value)) {
        md += `${headerPrefix} ${key}\n\n`;
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            md += `## Item ${index + 1}\n\n`;
            md += convertToMarkdown(item, level + 2);
          } else {
            md += `- ${item}\n`;
          }
        });
        md += '\n';
      } else {
        md += `**${key}**: ${value}\n\n`;
      }
    }
    return md;
  };
  
  markdown += convertToMarkdown(data);
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format assessment data for export
 */
export function formatAssessmentForExport(assessmentData: any): ExportData {
  return {
    metadata: {
      platform: 'ImpactSoluce™ by ERMITS',
      exportDate: new Date().toISOString(),
      version: '1.0',
    },
    assessment: assessmentData,
  };
}

/**
 * Format dashboard data for export
 */
export function formatDashboardForExport(dashboardData: any): ExportData {
  return {
    metadata: {
      platform: 'ImpactSoluce™ by ERMITS',
      exportDate: new Date().toISOString(),
      version: '1.0',
    },
    dashboard: dashboardData,
  };
}

/**
 * Generate HTML content for PDF export (legacy function - use downloadPDF instead)
 * @deprecated Use downloadPDF with options instead
 */
function generateHTMLForPDFLegacy(title: string, content: any): string {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      margin: 2cm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      color: #059669;
      border-bottom: 3px solid #059669;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #047857;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    h3 {
      color: #065f46;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f3f4f6;
      font-weight: 600;
    }
    .metadata {
      background-color: #f9fafb;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 30px;
      font-size: 0.9em;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 0.85em;
      color: #666;
      text-align: center;
    }
    .section {
      margin-bottom: 30px;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 500;
    }
    .badge-success {
      background-color: #d1fae5;
      color: #065f46;
    }
    .badge-warning {
      background-color: #fef3c7;
      color: #92400e;
    }
    .badge-error {
      background-color: #fee2e2;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="metadata">
    <strong>Platform:</strong> ImpactSoluce™ by ERMITS<br>
    <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
    <strong>Version:</strong> 1.0
  </div>
  ${convertToHTML(content)}
  <div class="footer">
    <p>This report was generated by ImpactSoluce™ ESG Risk Intelligence Platform</p>
    <p>© ${new Date().getFullYear()} ERMITS. All rights reserved.</p>
  </div>
</body>
</html>
  `;
  return html;
}

/**
 * Convert data object to HTML
 */
function convertToHTML(obj: any, level: number = 2): string {
  let html = '';
  
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      html += '<ul>';
      obj.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          html += `<li><strong>Item ${index + 1}:</strong><div class="section">${convertToHTML(item, level + 1)}</div></li>`;
        } else {
          html += `<li>${escapeHtml(String(item))}</li>`;
        }
      });
      html += '</ul>';
    } else {
      for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) {
          continue;
        }
        
        const headerTag = `h${Math.min(level, 6)}`;
        html += `<${headerTag}>${escapeHtml(String(key))}</${headerTag}>`;
        
        if (typeof value === 'object') {
          html += `<div class="section">${convertToHTML(value, level + 1)}</div>`;
        } else {
          html += `<p>${escapeHtml(String(value))}</p>`;
        }
      }
    }
  } else {
    html += `<p>${escapeHtml(String(obj))}</p>`;
  }
  
  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Download data as PDF using browser print API
 * Enhanced version with better formatting and direct download option
 * Note: This uses the browser's print dialog. For server-side PDF generation,
 * consider using a library like jsPDF, pdfmake, or a backend service.
 */
export function downloadPDF(
  title: string,
  data: ExportData,
  filename: string = 'impactsoluce-report.pdf',
  options?: {
    orientation?: 'portrait' | 'landscape';
    includeMetadata?: boolean;
  }
): void {
  const html = generateHTMLForPDF(title, data, options);
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Unable to open print window. Please allow popups for this site.');
  }
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Note: The user will need to choose "Save as PDF" in the print dialog
      // For automatic PDF download, consider using jsPDF or a backend service
    }, 500);
  };
}

/**
 * Generate PDF-ready HTML with enhanced formatting
 */
function generateHTMLForPDF(title: string, content: any, options?: { orientation?: 'portrait' | 'landscape'; includeMetadata?: boolean }): string {
  const orientation = options?.orientation || 'portrait';
  const includeMetadata = options?.includeMetadata !== false;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      margin: 2cm;
      size: A4 ${orientation};
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: white;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
      @page {
        margin: 1.5cm;
      }
    }
    h1 {
      color: #059669;
      border-bottom: 3px solid #059669;
      padding-bottom: 10px;
      margin-bottom: 30px;
      font-size: 2em;
    }
    h2 {
      color: #047857;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 1.5em;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 5px;
    }
    h3 {
      color: #065f46;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 1.2em;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 0.9em;
    }
    th, td {
      border: 1px solid #d1d5db;
      padding: 10px 12px;
      text-align: left;
    }
    th {
      background-color: #f3f4f6;
      font-weight: 600;
      color: #374151;
    }
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    .metadata {
      background-color: #f9fafb;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 30px;
      font-size: 0.9em;
      border-left: 4px solid #059669;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      font-size: 0.85em;
      color: #6b7280;
      text-align: center;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }
    li {
      margin: 5px 0;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 500;
      margin: 2px;
    }
    .badge-success {
      background-color: #d1fae5;
      color: #065f46;
    }
    .badge-warning {
      background-color: #fef3c7;
      color: #92400e;
    }
    .badge-error {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .badge-info {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .score {
      font-size: 1.5em;
      font-weight: bold;
      color: #059669;
    }
    .progress-bar {
      width: 100%;
      height: 20px;
      background-color: #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-fill {
      height: 100%;
      background-color: #059669;
      transition: width 0.3s ease;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      background-color: #ffffff;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${includeMetadata ? `
  <div class="metadata">
    <strong>Platform:</strong> ImpactSoluce™ by ERMITS<br>
    <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
    <strong>Version:</strong> 1.0<br>
    <strong>Report Type:</strong> ESG Compliance Report
  </div>
  ` : ''}
  ${convertToHTML(content)}
  <div class="footer">
    <p><strong>This report was generated by ImpactSoluce™ ESG Risk Intelligence Platform</strong></p>
    <p>© ${new Date().getFullYear()} ERMITS. All rights reserved.</p>
    <p>Confidential - For internal use only</p>
  </div>
</body>
</html>
  `;
  return html;
}

/**
 * Export data to PDF using canvas-based approach (for charts/images)
 * This is a fallback method that creates a printable HTML page
 */
/**
 * Export data to PDF using canvas-based approach (for charts/images)
 * This is a fallback method that creates a printable HTML page
 */
export function exportToPDFPrintable(
  title: string,
  data: ExportData,
  options?: {
    includeCharts?: boolean;
    orientation?: 'portrait' | 'landscape';
  }
): string {
  return generateHTMLForPDF(title, data, options);
}

