/**
 * Shared Contracts: Leave Report Generation
 *
 * ID: 9
 * Title: Administrator Generate and Export Comprehensive Leave Reports
 */

// =============================================================================
// ENUMS & CONSTANTS
// =============================================================================

/**
 * Represents the status of a leave request.
 */
export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

/**
 * Defines the types of reports an administrator can generate.
 * Corresponds to FR-021.
 */
export enum ReportType {
  DEPARTMENT_LEAVE = 'DEPARTMENT_LEAVE',
  MONTHLY_LEAVE = 'MONTHLY_LEAVE',
  EMPLOYEE_LEAVE = 'EMPLOYEE_LEAVE',
}

/**
 * Defines the export formats for the generated reports.
 * Corresponds to FR-022 and FR-023.
 */
export enum ReportFormat {
  CSV = 'CSV',
  XLSX = 'XLSX', // For Excel
}

// =============================================================================
// REQUEST DTOs (Data Transfer Objects)
// =============================================================================

/**
 * DTO for the GET /reports API endpoint.
 * Defines the query parameters for requesting a report.
 */
export interface GetReportRequestDto {
  /**
   * The type of report to generate.
   */
  type: ReportType;

  /**
   * The desired file format for the report.
   */
  format: ReportFormat;

  /**
   * The unique identifier for the department.
   * Required when `type` is `ReportType.DEPARTMENT_LEAVE`.
   */
  departmentId?: string;

  /**
   * The unique identifier for the employee.
   * Required when `type` is `ReportType.EMPLOYEE_LEAVE`.
   */
  employeeId?: string;

  /**
   * The month for the report (1-12).
   * Required when `type` is `ReportType.MONTHLY_LEAVE`.
   */
  month?: number;

  /**
   * The year for the report (e.g., 2024).
   * Required when `type` is `ReportType.MONTHLY_LEAVE`.
   */
  year?: number;
}


// =============================================================================
// REPORT DATA STRUCTURES
// These interfaces define the data structure (columns) within the exported files.
// They are not direct API response DTOs but represent the contract for the file content.
// =============================================================================

/**
 * Represents a single row in a Department Leave Report.
 */
export interface DepartmentLeaveReportRow {
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  endDate: string; // ISO 8601 format (YYYY-MM-DD)
  durationDays: number;
  status: LeaveStatus;
}

/**
 * Represents a single row in a Monthly Leave Report.
 */
export interface MonthlyLeaveReportRow {
  departmentName: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  endDate: string; // ISO 8601 format (YYYY-MM-DD)
  durationDays: number;
  status: LeaveStatus;
}

/**
 * Represents a single row in an Employee Leave Report.
 */
export interface EmployeeLeaveReportRow {
  leaveType: string;
  startDate: string; // ISO 8601 format (YYYY-MM-DD)
  endDate: string; // ISO 8601 format (YYYY-MM-DD)
  durationDays: number;
  status: LeaveStatus;
  reason: string;
  approvedBy?: string; // Name of the manager who approved/rejected
  processedDate?: string; // ISO 8601 format
}

// =============================================================================
// API ERROR RESPONSE
// =============================================================================

/**
 * A standardized error response format for API failures.
 */
export interface ErrorResponseDto {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string; // ISO 8601 format
  path: string;
}
