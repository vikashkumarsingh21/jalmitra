
// backend/server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
main();


// Inquiry schema
const inquirySchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  job_title: String,
  country: { type: String, required: true },
  state: { type: String, required: true },
  industry: { type: String, required: true },
  message: String,
  status: { type: String, default: "new" },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Inquiry = mongoose.model("Inquiry", inquirySchema);

// Email configuration (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'jalmitra1@outlook.com',
    pass: 'your_app_password' // Use app password for security
  }
});

// Routes

// Submit new inquiry (from contact form)
app.post('/api/inquiries', async (req, res) => {
  const {
    fullName,
    email,
    phone,
    company,
    jobTitle,
    country,
    state,
    industry,
    message
  } = req.body; 

  if (!fullName || !email || !phone || !company || !country || !state || !industry) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const inquiry = new Inquiry({
      full_name: fullName,
      email,
      phone,
      company,
      job_title: jobTitle || null,
      country,
      state,
      industry,
      message: message || null
    });

    const savedInquiry = await inquiry.save();

    // Send confirmation email to customer
    const customerMailOptions = {
      from: 'jalmitra1@outlook.com',
      to: email,
      subject: 'Thank you for your inquiry - Jalmitra',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Thank you for your inquiry, ${fullName}!</h2>
          <p>We have received your inquiry about Jalmitra smart water cleaning solutions. Our team will review your requirements and get back to you within 3-4 business days.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">Your Inquiry Details:</h3>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Industry:</strong> ${industry}</p>
            <p><strong>Location:</strong> ${state}, ${country}</p>
            <p><strong>Message:</strong> ${message || 'No specific message provided'}</p>
          </div>
          <p>Best regards,<br>The Jalmitra Team</p>
        </div>
      `
    };

    // Send notification email to admin
    const adminMailOptions = {
      from: 'jalmitra1@outlook.com',
      to: 'jalmitra1@outlook.com',
      subject: `New Inquiry from ${fullName} - ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">New Customer Inquiry</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #2c3e50; margin-top: 0;">Contact Information:</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Job Title:</strong> ${jobTitle || 'Not specified'}</p>
            <p><strong>Location:</strong> ${state}, ${country}</p>
            <p><strong>Industry:</strong> ${industry}</p>
            <p><strong>Message:</strong> ${message || 'No specific message provided'}</p>
          </div>
          <p><strong>Inquiry ID:</strong> ${savedInquiry._id}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    transporter.sendMail(customerMailOptions, err => {
      if (err) console.error('Error sending customer email:', err);
    });

    transporter.sendMail(adminMailOptions, err => {
      if (err) console.error('Error sending admin email:', err);
    });

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiryId: savedInquiry._id
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
});

// Get all inquiries (for admin dashboard)
app.get('/api/inquiries', async (req, res) => {
  try {
    const { status, dateFrom, dateTo, search, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (dateFrom || dateTo) {
      filter.created_at = {};
      if (dateFrom) filter.created_at.$gte = new Date(dateFrom);
      if (dateTo) filter.created_at.$lte = new Date(dateTo);
    }
    if (search) {
      filter.$or = [
        { full_name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { message: new RegExp(search, 'i') }
      ];
    }

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      inquiries,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Get inquiry by ID
app.get('/api/inquiries/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(inquiry);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

// Update inquiry status
app.put('/api/inquiries/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'in-progress', 'resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' }); 
  }

  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update inquiry' }); 
  }
});

// Delete inquiry
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// Get inquiry statistics
app.get('/api/inquiries/stats', async (req, res) => {
  try {
    const total = await Inquiry.countDocuments();
    const newCount = await Inquiry.countDocuments({ status: 'new' });
    const inProgress = await Inquiry.countDocuments({ status: 'in-progress' });
    const resolved = await Inquiry.countDocuments({ status: 'resolved' });

    res.json({ total, new: newCount, inProgress, resolved });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Export inquiries to CSV
app.get('/api/inquiries/export', async (req, res) => {
  try {
    const rows = await Inquiry.find().sort({ created_at: -1 });

    const csvHeader = 'ID,Name,Email,Phone,Company,Job Title,Country,State,Industry,Message,Status,Created At,Updated At\n';
    const csvRows = rows.map(row => {
      return `${row._id},"${row.full_name}","${row.email}","${row.phone}","${row.company}","${row.job_title || ''}","${row.country}","${row.state}","${row.industry}","${row.message || ''}","${row.status}","${row.created_at}","${row.updated_at}"`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="jalmitra_inquiries.csv"');
    res.send(csvContent);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to export inquiries' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => { 
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 
