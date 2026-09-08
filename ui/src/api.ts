import { ReportType, ExportFormat } from './types';

export const generateAndExportReport = async (
  reportType: ReportType,
  format: ExportFormat,
): Promise<Blob> => {
  const response = await fetch(`/api/reports?type=${reportType}&format=${format}`);

  if (!response.ok) {
    throw new Error(`Failed to generate report: ${response.statusText}`);
  }

  return response.blob();
};
