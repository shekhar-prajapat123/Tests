import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-api-server',
      configureServer(server) {
        server.middlewares.use('/api/reports', (req, res) => {
          // NFR-010: Reports should be generated within 10 seconds.
          // We'll simulate a 500ms delay.
          const delay = 500;

          const url = new URL(req.url, `http://${req.headers.host}`);
          const type = url.searchParams.get('type') || 'unknown';
          const format = url.searchParams.get('format') || 'csv';

          const reportName = `${type.charAt(0).toUpperCase() + type.slice(1)} Leave Report`;

          let data = '';
          let contentType = '';

          if (format === 'csv') {
            contentType = 'text/csv';
            data = `"Report Name","${reportName}"\nID,Employee Name,Leave Type,Days Taken\n1,Alice Johnson,Annual,5\n2,Bob Williams,Sick,2\n3,Charlie Brown,Unpaid,1`;
          } else { // excel
            contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            // This is a mock. Real .xlsx is a binary format.
            data = `Report Name: ${reportName}\nID\tEmployee Name\tLeave Type\tDays Taken\n1\tAlice Johnson\tAnnual\t5\n2\tBob Williams\tSick\t2\n3\tCharlie Brown\tUnpaid\t1`;
          }

          setTimeout(() => {
            res.setHeader('Content-Type', contentType);
            res.end(data);
          }, delay);
        });
      },
    },
  ],
});
