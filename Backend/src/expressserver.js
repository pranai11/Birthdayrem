require('dotenv').config();
process.env.TZ = 'Asia/Kolkata'; // Set to Indian Standard Time
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');

// console.log('MONGODB_URI:', process.env.MONGODB_URI);
// console.log('EMAIL_USER:', process.env.EMAIL_USER);

const app = express();
app.use(express.json());
app.use(cors("*")); // Assuming frontend is served from port 3000

const uri = process.env.MONGODB_URI;
// console.log('MongoDB URI:', uri); // Log the URI (make sure to remove this in production)

if (!uri) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db, usersCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db("BirthdayReminder");
    usersCollection = db.collection("Users");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

connectToDatabase();

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Modified route to add a birthday reminder
app.post('/api/add-birthday', async (req, res) => {
  try {
    console.log('Received request to add birthday:', req.body);
    const { name, date, recurrence, remindOn, notes, userId } = req.body;
    
    if (!name || !date || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const birthdayReminder = {
      name,
      date,
      recurrence,
      remindOn,
      notes,
      userId,
      createdAt: new Date()
    };

    const database = client.db("BirthdayReminder");
    const collection = database.collection("Birthdays");
    
    const result = await collection.insertOne(birthdayReminder);
    
    if (result.insertedId) {
      res.status(201).json({ message: "Birthday reminder added successfully", id: result.insertedId });
    } else {
      throw new Error("Failed to insert birthday reminder");
    }
  } catch (error) {
    console.error("Error adding birthday reminder:", error);
    res.status(500).json({ message: "Error adding birthday reminder", error: error.message });
  }
});

// New route to get birthdays for a specific user
app.get('/api/birthdays/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const database = client.db("BirthdayReminder");
    const collection = database.collection("Birthdays");
    
    const birthdays = await collection.find({ userId }).toArray();
    
    res.status(200).json(birthdays);
  } catch (error) {
    console.error("Error fetching birthdays:", error);
    res.status(500).json({ message: "Error fetching birthdays" });
  }
});

// Add this new route to delete a birthday
app.delete('/api/birthdays/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const database = client.db("BirthdayReminder");
    const collection = database.collection("Birthdays");
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Birthday deleted successfully" });
    } else {
      res.status(404).json({ message: "Birthday not found" });
    }
  } catch (error) {
    console.error("Error deleting birthday:", error);
    res.status(500).json({ message: "Error deleting birthday" });
  }
});

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const database = client.db("BirthdayReminder");
    const usersCollection = database.collection("Users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user with plain text password
    const newUser = {
      username,
      email,
      password, // Storing password as plain text
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "User created successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const database = client.db("BirthdayReminder");
    const usersCollection = database.collection("Users");

    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password (plain text comparison)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Send user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Add this new route to save reminder settings
app.post('/api/save-reminder-settings', async (req, res) => {
  try {
    const { userId, remindMethod, reminderType, personalMessage } = req.body;
    
    // Validate input
    if (!userId || !remindMethod || !reminderType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Update user settings in the database
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 
        reminderSettings: {
          remindMethod,
          reminderType,
          personalMessage
        }
      }},
      { upsert: true } // This will create a new document if it doesn't exist
    );

    if (result.matchedCount === 1 || result.upsertedCount === 1) {
      res.json({ success: true, message: 'Settings saved successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found or settings not updated' });
    }
  } catch (error) {
    console.error('Error saving reminder settings:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Add this new route to get reminder settings
app.get('/api/reminder-settings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const database = client.db("BirthdayReminder");
    const usersCollection = database.collection("remind-me");

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (user && user.reminderSettings) {
      res.status(200).json(user.reminderSettings);
    } else {
      res.status(404).json({ message: "Reminder settings not found" });
    }
  } catch (error) {
    console.error("Error fetching reminder settings:", error);
    res.status(500).json({ message: "Error fetching reminder settings" });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendBirthdayReminders() {
  try {
    const database = client.db("BirthdayReminder");
    const birthdaysCollection = database.collection("Birthdays");
    const usersCollection = database.collection("Users");

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    console.log(`Checking for reminders at ${now.toISOString()}`);
    console.log(`Looking for birthdays on ${tomorrow.toISOString().split('T')[0]}`);
    console.log(`Current time: ${now.getHours().toString().padStart(2, '0')}:00`);

    const searchCriteria = {
      $expr: {
        $and: [
          { $eq: [{ $month: { $toDate: "$date" } }, tomorrow.getMonth() + 1] },
          { $eq: [{ $dayOfMonth: { $toDate: "$date" } }, tomorrow.getDate()] }
        ]
      },
      isCanceled: { $ne: true },
      remindOn: `${now.getHours().toString().padStart(2, '0')}:00`
    };

    console.log('Search criteria:', JSON.stringify(searchCriteria, null, 2));

    const upcomingBirthdays = await birthdaysCollection.find(searchCriteria).toArray();

    console.log(`Found ${upcomingBirthdays.length} upcoming birthdays`);
    console.log('Upcoming birthdays:', JSON.stringify(upcomingBirthdays, null, 2));

    for (const birthday of upcomingBirthdays) {
      console.log(`Processing birthday for ${birthday.name}`);
      const user = await usersCollection.findOne({ _id: new ObjectId(birthday.userId) });
      if (user) {
        console.log(`Sending reminder to ${user.email}`);
        await sendEmailReminder(user, birthday);
      } else {
        console.log(`User not found for birthday ${birthday.name}`);
      }
    }
  } catch (error) {
    console.error('Error sending birthday reminders:', error);
  }
}

async function sendEmailReminder(user, birthday) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Birthday Reminder: ${birthday.name}`,
    text: `Don't forget! ${birthday.name}'s birthday is tomorrow.${birthday.notes ? ` Note: ${birthday.notes}` : ''}`
  };

  console.log('Attempting to send email with options:', mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent for ${birthday.name}'s birthday to ${user.email}`);
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error(`Error sending reminder email for ${birthday.name}'s birthday:`, error);
  }
}

// Run the reminder check every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('Running birthday reminder check...');
  console.log('Server time:', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  sendBirthdayReminders();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Test route for sending emails
app.get('/api/test-email', async (req, res) => {
  try {
    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to yourself for testing
      subject: 'Test Email from Birthday Reminder App',
      text: 'This is a test email from your Birthday Reminder application.'
    };

    await transporter.sendMail(testMailOptions);
    res.status(200).json({ message: "Test email sent successfully" });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ message: "Error sending test email", error: error.message });
  }
});

// Test route to trigger birthday reminders manually
app.get('/api/test-birthday-reminders', async (req, res) => {
  try {
    await sendBirthdayReminders();
    res.status(200).json({ message: "Birthday reminder check triggered successfully" });
  } catch (error) {
    console.error("Error triggering birthday reminders:", error);
    res.status(500).json({ message: "Error triggering birthday reminders", error: error.message });
  }
});

// Add this new route to cancel a birthday reminder
app.post('/api/cancel-birthday-reminder/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const database = client.db("BirthdayReminder");
    const collection = database.collection("Birthdays");
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isCanceled: true } }
    );
    
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Birthday reminder canceled successfully" });
    } else {
      res.status(404).json({ message: "Birthday reminder not found or already canceled" });
    }
  } catch (error) {
    console.error("Error canceling birthday reminder:", error);
    res.status(500).json({ message: "Error canceling birthday reminder" });
  }
});

async function checkDatabaseContents() {
  const database = client.db("BirthdayReminder");
  const birthdaysCollection = database.collection("Birthdays");
  const usersCollection = database.collection("Users");

  const birthdays = await birthdaysCollection.find({}).toArray();
  console.log('All birthdays in database:', birthdays);
}

// Call this function when your server starts
checkDatabaseContents();
