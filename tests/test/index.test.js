const { handler } = require('../index');
const { Parser } = require('json2csv');

// Mock the json2csv library to control its behavior in tests
jest.mock('json2csv');

describe('Leave Report Lambda Handler', () => {
    // A mock implementation of the json2csv Parser for happy path tests
    const mockParse = jest.fn((data) => {
        if (!data || data.length === 0) return '';
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(item => Object.values(item).join(','));
        return [headers, ...rows].join('\n');
    });

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        // Set up the default mock implementation for the Parser
        Parser.mockImplementation(() => {
            return {
                parse: mockParse,
            };
        });
    });

    describe('Routing', () => {
        test('should return 404 for a non-existent path', async () => {
            const event = {
                httpMethod: 'GET',
                path: '/non-existent-path',
            };
            const response = await handler(event, {});
            expect(response.statusCode).toBe(404);
            expect(response.body).toBe(JSON.stringify({ message: 'Not Found' }));
            expect(response.headers['Content-Type']).toBe('application/json');
        });

        test('should return 404 for an unsupported HTTP method', async () => {
            const event = {
                httpMethod: 'POST',
                path: '/reports',
            };
            const response = await handler(event, {});
            expect(response.statusCode).toBe(404);
            expect(response.body).toBe(JSON.stringify({ message: 'Not Found' }));
        });
    });

    describe('GET /reports', () => {
        // Happy Path Tests
        test('should generate a Department report in CSV format', async () => {
            const event = {
                httpMethod: 'GET',
                path: '/reports',
                queryStringParameters: {
                    type: 'Department',
                    format: 'CSV',
                },
            };
            const response = await handler(event, {});
            expect(response.statusCode).toBe(200);
            expect(response.headers['Content-Type']).toBe('text/csv');
            expect(response.headers['Content-Disposition']).toBe('attachment; filename="report_department.csv"');
            expect(mockParse).toHaveBeenCalled();
            expect(typeof response.body).toBe('string');
            expect(response.body).toContain('id,employeeId,employeeName,department,leaveType,startDate,endDate,status');
        });

        test('should generate a Monthly report in Excel format', async () => {
            const event = {
                httpMethod: 'GET',
                path: '/reports',
                queryStringParameters: {
                    type: 'Monthly',
                    format: 'Excel',
                },
            };
            const response = await handler(event, {});
            expect(response.statusCode).toBe(200);
            expect(response.headers['Content-Type']).toBe('application/vnd.ms-excel');
            expect(response.headers['Content-Disposition']).toBe('attachment; filename="report_monthly.xls"');
            expect(mockParse).toHaveBeenCalled();
            // The test data for the monthly report (July 2024) has 3 entries
            expect(mockParse.mock.calls[0][0].length).toBe(3);
        });

        test('should handle case-insensitive parameters successfully', async () => {
            const event = {
                httpMethod: 'GET',
                path: '/reports',
                queryStringParameters: {
                    type: 'employee',
                    format: 'excel',
                },
            };
            const response = await handler(event, {});
            expect(response.statusCode).toBe(200);
            expect(response.headers['Content-Type']).toBe('application/vnd.ms-excel');
            expect(response.headers['Content-Disposition']).toBe('attachment; filename="report_employee.xls"');
            expect(mockParse).toHaveBeenCalled();
            expect(mockParse.mock.calls[0][0].length).toBe(4);
        });

        // Error and Edge Case Tests
        test('should return 400 if "type" query parameter is missing', async () => {
            const event = {
                httpMethod: 'GET',
                path: '/reports',
                queryStringParameters: {
                    format: 'CSV',
                },
            };
            const response = await handler(event, {});
            expect(response.statusCode).toBe(400);
            expect(response.body).toBe(JSON.stringify({ message: 'Query parameters "type" and "format" are required.' }));
        });

        test('should return 400 if queryStringParameters object is null', async () => {
            const event = {
                httpMethod: 'GET',
                path: '/reports',
                queryStringParameters: null,
            };
            const response = await handler(event, {});
            expect(response.statusCode).toBe(400);
            expect(response.body).toBe(JSON.stringify({ message: 'Query parameters "type" and "format" are required.' }));
        });

        test('should return 400 for an invalid report "type"', async () => {
            const event = {
                httpMethod: 'GET',
                path: '/reports',
                queryStringParameters: {
                    type: 'InvalidType',
                    format: 'CSV',
                },
            };
            const response = await handler(event, {});
            expect(response.statusCode).toBe(400);
            expect(response.body).toBe(JSON.stringify({ message: 'Invalid report type. Valid types are: Department, Monthly, Employee' }));
        });

        test('should return 400 for an invalid report "format"', async () => {
            const event = {
                httpMethod: 'GET',
                path: '/reports',
                queryStringParameters: {
                    type: 'Department',
                    format: 'PDF',
                },
            };
            const response = await handler(event, {});
            expect(response.statusCode).toBe(400);
            expect(response.body).toBe(JSON.stringify({ message: 'Invalid format. Valid formats are: Excel, CSV' }));
        });

        test('should return 500 if CSV generation fails', async () => {
            Parser.mockImplementation(() => {
                return {
                    parse: jest.fn().mockImplementation(() => {
                        throw new Error('Internal CSV Error');
                    }),
                };
            });
            
            const event = {
                httpMethod: 'GET',
                path: '/reports',
                queryStringParameters: {
                    type: 'Department',
                    format: 'CSV',
                },
            };

            const response = await handler(event, {});
            expect(response.statusCode).toBe(500);
            expect(response.body).toBe(JSON.stringify({ message: 'Failed to generate report.' }));
        });
    });
});