// src/pages/BillingForm.js
import React, { useState } from 'react';
import './BillingForm.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateBillingData } from '../redux/billingSlice';

const BillingForm = () => {
    const [billDateTime, setBillDateTime] = useState('');

  const dispatch = useDispatch();
  const records = useSelector((state) => state.billing.records || []);
  const billing = records[records.length - 1] || {};

  const [formData, setFormData] = useState({
    customerName: '',
    itemName: '',
    quantity: '',
    price: '',
    gst: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price) || 0;
    const gst = parseFloat(formData.gst) || 0;

    const subtotal = quantity * price;
    const gstAmount = (subtotal * gst) / 100;
    const total = subtotal + gstAmount;
    const now = new Date();
    const formattedDateTime = now.toLocaleString(); 

    dispatch(
      updateBillingData({
        ...formData,
        quantity,
        price,
        gst,
        totalAmount: total,
        gstAmount,
        subtotal,
        billDateTime: formattedDateTime,
      })
    );
    e.preventDefault();
    setBillDateTime(formattedDateTime);
    setSubmitted(true);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Billing Page</h3>

      <div className="row">
        {/* Left Side - Billing Form */}
        <div className="col-md-6">
          <form className="p-4 border rounded shadow-sm bg-white" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                className="form-control"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price per Item (₹)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">GST (%)</label>
              <input
                type="number"
                className="form-control"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Generate Bill
            </button>
          </form>
        </div>

        {/* Right Side - Billing Summary */}
        <div className="col-md-6">
          {submitted && (
            <div className="card shadow-sm">
              <div className="card-header  bg-primary fw-semibold">
                Billing Summary
              </div>
              <div className="card-body">
              <p><strong>Bill Date & Time:</strong> {billDateTime}</p>
                <p><strong>Customer:</strong> {billing.customerName}</p>
                <p><strong>Item:</strong> {billing.itemName}</p>
                <p><strong>Quantity:</strong> {billing.quantity}</p>
                <p><strong>Price per item:</strong> ₹{(billing.price ?? 0).toFixed(2)}</p>
                <p><strong>GST:</strong> {billing.gst}%</p>
                <hr />
                <p><strong>Subtotal:</strong> ₹{(billing.subtotal??0).toFixed(2)}</p>
                <p><strong>GST Amount:</strong> ₹{(billing.gstAmount??0).toFixed(2)}</p>
                <h5 className="mt-3"><strong>Total:</strong> ₹{billing.totalAmount.toFixed(2)}</h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingForm;
