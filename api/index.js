const { Parser } = require('json2csv');

// In-memory data store for leave records, seeded with example data.
const leaveRecords = [
    {
        id: 1,
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        department: 'Engineering',
        leaveType: 'Annual',
        startDate: '2024-07-10',
        endDate: '2024-07-12',
        status: 'Approved'
    },
    {
        id: 2,
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        department: 'Marketing',
        leaveType: 'Sick',
        startDate: '2024-07-15',
        endDate: '2024-07-15',
        status: 'Approved'
    },
    {
        id: 3,
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        department: 'Engineering',
        leaveType: 'Personal',
        startDate: '2024-08-01',
        endDate: '2024-08-02',
        status: 'Pending'
    },
    {
        id: 4,
        employeeId: 'EMP003',
        employeeName: 'Peter Jones',
        department: 'Engineering',
        leaveType: 'Annual',
        startDate: '2024-07-20',
        endDate: '2024-07-25',
        status: 'Approved'
    }
];

/**
 * AWS Lambda handler function to process API Gateway requests for leave reports.
 * @param {object} event - The API Gateway proxy event object.
 * @param {object} context - The Lambda context object.
 * @returns {Promise<object>} A promise that resolves to an API Gateway proxy response object.
 */
exports.handler = async (event, context) => {
    // Route based on HTTP method and path
    if (event.httpMethod === 'GET' && event.path === '/reports') {
        return generateReport(event);
    }

    return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Not Found' })
    };
};

/**
 * Generates and formats a report based on query parameters.
 * @param {object} event - The API Gateway proxy event object.
 * @returns {object} An API Gateway proxy response object.
 */
const generateReport = (event) => {
    const { type, format } = event.queryStringParameters || {};

    // Validate required query parameters
    if (!type || !format) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Query parameters \"type\" and \"format\" are required.' })
        };
    }

    const validTypes = ['Department', 'Monthly', 'Employee'];
    const validFormats = ['Excel', 'CSV'];

    // Case-insensitive validation
    const reportType = validTypes.find(t => t.toLowerCase() === type.toLowerCase());
    const reportFormat = validFormats.find(f => f.toLowerCase() === format.toLowerCase());

    if (!reportType) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `Invalid report type. Valid types are: ${validTypes.join(', ')}` })
        };
    }

    if (!reportFormat) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `Invalid format. Valid formats are: ${validFormats.join(', ')}` })
        };
    }

    let reportData = [];

    // Filter data based on the report type
    switch (reportType) {
        case 'Department':
            // For this report, we'll sort by department to group them
            reportData = [...leaveRecords].sort((a, b) => a.department.localeCompare(b.department) || a.employeeId.localeCompare(b.employeeId));
            break;
        case 'Monthly':
            // For this report, we'll filter for a specific month (e.g., July 2024)
            reportData = leaveRecords.filter(r => r.startDate.startsWith('2024-07'));
            break;
        case 'Employee':
            // For this report, we'll sort by employee to group them
            reportData = [...leaveRecords].sort((a, b) => a.employeeId.localeCompare(b.employeeId) || new Date(a.startDate) - new Date(b.startDate));
            break;
    }

    if (reportData.length === 0) {
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'No data found for the selected report criteria.' })
        };
    }

    try {
        const parser = new Parser();
        const csv = parser.parse(reportData);

        const contentType = reportFormat === 'Excel' ? 'application/vnd.ms-excel' : 'text/csv';
        const fileExtension = reportFormat === 'Excel' ? 'xls' : 'csv';

        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename=\"report_${reportType.toLowerCase()}.${fileExtension}\"`
            },
            body: csv
        };
    } catch (error) {
        console.error('Error generating CSV:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Failed to generate report.' })
        };
    }
};