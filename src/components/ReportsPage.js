import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportsPage = () => {
  const billingState = useSelector((state) => state.billing);
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const records = billingState.records || [];
  const uniqueMonths = [...new Set(records.map(r => new Date(r.billDateTime).toLocaleString('en-IN', { month: 'long' })))];
  const uniqueYears = [...new Set(records.map(r => new Date(r.billDateTime).getFullYear()))];

  const filteredRecords = records.filter((record) => {
    const billDate = new Date(record.billDateTime);
    const recordMonth = billDate.toLocaleString('en-IN', { month: 'long' });
    const recordYear = billDate.getFullYear();

    if (filterDate) {
      const selectedDate = new Date(filterDate);
      const billDateOnly = new Date(billDate.toDateString());
      const selectedDateOnly = new Date(selectedDate.toDateString());

      if (billDateOnly.getTime() !== selectedDateOnly.getTime()) {
        return false;
      }
    }

    return (
      (filterMonth === '' || recordMonth === filterMonth) &&
      (filterYear === '' || recordYear === parseInt(filterYear))
    );
  });

  const exportToExcel = (data) => {
    const worksheetData = data.map((r, idx) => [
      idx + 1,
      new Date(r.billDateTime).toLocaleDateString('en-IN'),
      new Date(r.billDateTime).toLocaleTimeString('en-IN'),
      new Date(r.billDateTime).toLocaleString('en-IN', { month: 'long' }),
      new Date(r.billDateTime).getFullYear(),
      r.customerName,
      r.itemName,
      r.quantity,
      r.price,
      r.gst,
      r.totalAmount?.toFixed(2) || '0.00',
    ]);

    const grandTotal = data.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    worksheetData.push(['', '', '', '', '', '', '', '', '', 'Grand Total', grandTotal.toFixed(2)]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['#', 'Date', 'Time', 'Month', 'Year', 'Customer', 'Item', 'Qty', 'Price (₹)', 'GST (%)', 'Total (₹)'],
      ...worksheetData
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'BillingReport.xlsx');
  };

  const exportToPDF = (data) => {
    const doc = new jsPDF();
    const tableData = data.map((r, idx) => [
      idx + 1,
      new Date(r.billDateTime).toLocaleDateString('en-IN'),
      new Date(r.billDateTime).toLocaleTimeString('en-IN'),
      new Date(r.billDateTime).toLocaleString('en-IN', { month: 'long' }),
      new Date(r.billDateTime).getFullYear(),
      r.customerName,
      r.itemName,
      r.quantity,
      r.price,
      r.gst,
      r.totalAmount?.toFixed(2) || '0.00',
    ]);

    const grandTotal = data.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    tableData.push(['', '', '', '', '', '', '', '', '', 'Grand Total', grandTotal.toFixed(2)]);

    doc.autoTable({
      head: [['#', 'Date', 'Time', 'Month', 'Year', 'Customer', 'Item', 'Qty', 'Price (₹)', 'GST (%)', 'Total (₹)']],
      body: tableData,
    });

    doc.save('BillingReport.pdf');
  };

  const totalSales = filteredRecords.reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Billing Reports</h3>

      <div className="mb-3 d-flex gap-3 flex-wrap">
        <div>
          <label className="form-label">Month:</label>
          <select className="form-select" onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="">All</option>
            {uniqueMonths.map((month, idx) => (
              <option key={idx} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Year:</label>
          <select className="form-select" onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">All</option>
            {uniqueYears.map((year, idx) => (
              <option key={idx} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Date:</label>
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <div className="align-self-end">
          <button className="btn btn-success me-2" onClick={() => exportToExcel(filteredRecords)}>Export Excel</button>
          <button className="btn btn-danger" onClick={() => exportToPDF(filteredRecords)}>Export PDF</button>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <p className="text-danger">No billing records found for selected filters.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Time</th>
                <th>Month</th>
                <th>Year</th>
                <th>Customer</th>
                <th>Item</th>
                <th>Qty</th>
                <th>Price (₹)</th>
                <th>GST (%)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(record.billDateTime).toLocaleDateString('en-IN')}</td>
                  <td>{new Date(record.billDateTime).toLocaleTimeString('en-IN')}</td>
                  <td>{new Date(record.billDateTime).toLocaleString('en-IN', { month: 'long' })}</td>
                  <td>{new Date(record.billDateTime).getFullYear()}</td>
                  <td>{record.customerName}</td>
                  <td>{record.itemName}</td>
                  <td>{record.quantity}</td>
                  <td>{record.price}</td>
                  <td>{record.gst}</td>
                  <td>{record.totalAmount?.toFixed(2) || '0.00'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-warning">
                <td colSpan="10" className="text-end fw-bold">Total Sales (₹)</td>
                <td className="fw-bold">{totalSales.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
