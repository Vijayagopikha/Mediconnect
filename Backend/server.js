import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import sendEMail from './mail.js';

dotenv.config();

const app = express();
app.use(cors());

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Create a Mongoose schema for the appointment details
const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  address: String,
  phone: String,
  date: Date,
  time: String
});

// Create a Mongoose model based on the schema
const Appointment = mongoose.model('Appointment', appointmentSchema);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure email is unique
  },
  password: {
    type: String,
    required: true
  }
});

// Create model for users collection
const User = mongoose.model('User', userSchema);

// Route to handle user signup
app.post('/signup', async (req, res) => {
  try {
    // Extract user details from request body
    const { username, email, password } = req.body;

    // Create a new user instance
    const newUser = new User({ username, email, password });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with the saved user object
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route to handle user login
app.post('/login', async (req, res) => {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        // User not found
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if password matches
      if (user.password !== password) {
        // Password incorrect
        return res.status(401).json({ error: 'Incorrect password' });
      }
  
      // Password correct, login successful
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Route to handle form submission for appointment
app.post('/submit-appointment', async (req, res) => {
  try {
    // Extract appointment details from request body
    const { name, email, age, address, phone, date, time,dtrmail } = req.body;

    // Create a new appointment instance
    const newAppointment = new Appointment({
      name,
      email,
      age,
      address,
      phone,
      date,
      time
    });

    // Save the appointment to the database
    console.log(dtrmail);
    const savedAppointment = await newAppointment.save();
    sendEMail(name,email,age,address,phone,date,time,dtrmail);
    console.log(savedAppointment);
    // Respond with a success message
    res.status(201).json({ message: 'Appointment submitted successfully!' });
  } catch (error) {
    console.log(error);
    console.error('Error submitting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});