import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ReportsPage = () => {
  const [selectedDate, setSelectedDate] = useState('');

//   const billingState = useSelector((state) => state.billing || { records: [] });
//   const records = billingState.records || [];
const billingState = useSelector((state) => state.billing);
const records = billingState.records || [];
  console.log("Selected Date:", selectedDate);
  console.log("All Records:", records.map(r => r.dateOnly));
  
  const filteredRecords = selectedDate && selectedDate !== ''
  ? records.filter((record) => {
      if (!record.billDateTime) return false;

      const recordDate = new Date(record.billDateTime)
        .toISOString()
        .split('T')[0]; // returns "YYYY-MM-DD"

      return recordDate === selectedDate;
    })
  : records;


  return (
    <div className="container mt-4">
      <h3 className="mb-3">Billing Reports</h3>

      {/* Date Filter */}
      <div className="mb-4">
        <label className="form-label">Filter by Date:</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Report Table */}
      {filteredRecords.length === 0 ? (
        <p className="text-danger">No billing records found for selected date.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Date & Time</th>
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
                  <td> {record.billDateTime
    ? new Date(record.billDateTime).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A'}</td>
                  <td>{record.customerName}</td>
                  <td>{record.itemName}</td>
                  <td>{record.quantity}</td>
                  <td>{record.price}</td>
                  <td>{record.gst}</td>
                  <td>{(record.totalAmount ?? 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
