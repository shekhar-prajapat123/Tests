import { useState } from 'react';
import { generateAndExportReport } from '../api';
import { REPORT_TYPES, EXPORT_FORMATS, ReportType, ExportFormat } from '../types';

function LeaveReportGenerator() {
  const [reportType, setReportType] = useState<ReportType>('department');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('excel');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const blob = await generateAndExportReport(reportType, exportFormat);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      const fileExtension = exportFormat === 'excel' ? 'xlsx' : 'csv';
      a.download = `${reportType}_leave_report.${fileExtension}`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="report-form" onSubmit={handleSubmit}>
        {/* FR-021: I can generate reports such as ... */}
        <div className="form-group">
          <label htmlFor="reportType">Report Type</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            disabled={isLoading}
          >
            {REPORT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="exportFormat">Export Format</label>
          <select
            id="exportFormat"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
            disabled={isLoading}
          >
            {EXPORT_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate and Export Report'}
        </button>
      </form>

      {isLoading && <div className="status-message loading">Generating report... Please wait.</div>}
      {error && <div className="status-message error">Error: {error}</div>}
    </div>
  );
}

export default LeaveReportGenerator;
