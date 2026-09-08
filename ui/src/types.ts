export type ReportType = 'department' | 'monthly' | 'employee';
export type ExportFormat = 'excel' | 'csv';

export const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: 'department', label: 'Department Leave Report' },
  { value: 'monthly', label: 'Monthly Leave Report' },
  { value: 'employee', label: 'Employee Leave Report' },
];

export const EXPORT_FORMATS: { value: ExportFormat; label: string }[] = [
  // FR-022: I can export generated reports to Excel format
  { value: 'excel', label: 'Excel' },
  // FR-023: I can export generated reports to CSV format
  { value: 'csv', label: 'CSV' },
];
