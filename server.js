const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb+srv://satyam8804378323:satyam8804@cluster0.5svvhax.mongodb.net/users?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

app.use(
  app.use(
    cors({
      // origin: "https://xenostack.vercel.app", //this is for deployed version
      origin: "localhost:3001", // this is for local development
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
);

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { fName, lName, email, pass } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Create a new user
    const newUser = new User({
      fName,
      lName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'An error occurred during signup' });
  }
});

// Signin endpoint
app.post('/api/signin', async (req, res) => {
  try {
    // Signin logic (replace with your actual signin logic)
    res.json({ message: 'Signin successful' });
  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ error: 'An error occurred during signin' });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await newContact.save();

    res.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error during form submission:', error);
    res.status(500).json({ error: 'An error occurred during form submission' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});