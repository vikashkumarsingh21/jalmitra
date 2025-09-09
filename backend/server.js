// backend/server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database('./inquiries.db');

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT NOT NULL,
    job_title TEXT,
    country TEXT NOT NULL,
    state TEXT NOT NULL,
    industry TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Email configuration (configure with your email service)
const transporter = nodemailer.createTransporter({
  service: 'outlook', // or gmail, yahoo, etc.
  auth: {
    user: 'jalmitra1@outlook.com',
    pass: 'your_app_password' // Use app password for security
  }
});

// Routes

// Submit new inquiry (from contact form)
app.post('/api/inquiries', (req, res) => {
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

  // Validate required fields
  if (!fullName || !email || !phone || !company || !country || !state || !industry) {
    return res.status(400).json({ 
      error: 'Missing required fields' 
    });
  }

  // Insert into database
  const query = `
    INSERT INTO inquiries (
      full_name, email, phone, company, job_title, 
      country, state, industry, message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    fullName, email, phone, company, jobTitle || null,
    country, state, industry, message || null
  ], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save inquiry' });
    }

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
          <p>In the meantime, you can:</p>
          <ul>
            <li>Visit our website to learn more about Jalmitra</li>
            <li>Follow us on social media for updates</li>
            <li>Contact us directly at jalmitra1@outlook.com for urgent matters</li>
          </ul>
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
          <p><strong>Inquiry ID:</strong> ${this.lastID}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p>Please follow up within 3-4 business days.</p>
        </div>
      `
    };

    // Send emails
    transporter.sendMail(customerMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending customer email:', error);
      }
    });

    transporter.sendMail(adminMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending admin email:', error);
      }
    });

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiryId: this.lastID
    });
  });
});

// Get all inquiries (for admin dashboard)
app.get('/api/inquiries', (req, res) => {
  const { status, dateFrom, dateTo, search, page = 1, limit = 10 } = req.query;
  
  let query = 'SELECT * FROM inquiries WHERE 1=1';
  let params = [];

  // Apply filters
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (dateFrom) {
    query += ' AND date(created_at) >= ?';
    params.push(dateFrom);
  }

  if (dateTo) {
    query += ' AND date(created_at) <= ?';
    params.push(dateTo);
  }

  if (search) {
    query += ' AND (full_name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam, searchParam);
  }

  // Add pagination
  const offset = (page - 1) * limit;
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM inquiries WHERE 1=1';
    let countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (dateFrom) {
      countQuery += ' AND date(created_at) >= ?';
      countParams.push(dateFrom);
    }

    if (dateTo) {
      countQuery += ' AND date(created_at) <= ?';
      countParams.push(dateTo);
    }

    if (search) {
      countQuery += ' AND (full_name LIKE ? OR email LIKE ? OR company LIKE ? OR message LIKE ?)';
      const searchParam = `%${search}%`;
      countParams.push(searchParam, searchParam, searchParam, searchParam);
    }

    db.get(countQuery, countParams, (err, countResult) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch count' });
      }

      res.json({
        inquiries: rows,
        total: countResult.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult.total / limit)
      });
    });
  });
});

// Get inquiry by ID
app.get('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM inquiries WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch inquiry' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json(row);
  });
});

// Update inquiry status
app.put('/api/inquiries/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['new', 'in-progress', 'resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run(
    'UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update inquiry' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }

      res.json({ message: 'Status updated successfully' });
    }
  );
});

// Delete inquiry
app.delete('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM inquiries WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete inquiry' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  });
});

// Get inquiry statistics
app.get('/api/inquiries/stats', (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
      SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress_count,
      SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count
    FROM inquiries
  `;

  db.get(statsQuery, (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    res.json({
      total: row.total,
      new: row.new_count,
      inProgress: row.in_progress_count,
      resolved: row.resolved_count
    });
  });
});

// Export inquiries to CSV
app.get('/api/inquiries/export', (req, res) => {
  const query = 'SELECT * FROM inquiries ORDER BY created_at DESC';

  db.all(query, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to export inquiries' });
    }

    // Create CSV content
    const csvHeader = 'ID,Name,Email,Phone,Company,Job Title,Country,State,Industry,Message,Status,Created At,Updated At\n';
    const csvRows = rows.map(row => {
      return `${row.id},"${row.full_name}","${row.email}","${row.phone}","${row.company}","${row.job_title || ''}","${row.country}","${row.state}","${row.industry}","${row.message || ''}","${row.status}","${row.created_at}","${row.updated_at}"`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="jalmitra_inquiries.csv"');
    res.send(csvContent);
  });
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

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  db.close();
  process.exit(0);
});

module.exports = app;