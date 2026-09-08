import './App.css';
import LeaveReportGenerator from './components/LeaveReportGenerator';

function App() {
  return (
    <main className="container">
      <h1>Administrator Generate and Export Comprehensive Leave Reports</h1>
      <p>This tool allows administrators to generate and export reports to gain insights into leave data.</p>
      <LeaveReportGenerator />
    </main>
  );
}

export default App;
