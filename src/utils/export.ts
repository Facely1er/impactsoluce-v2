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

