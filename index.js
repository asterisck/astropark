const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');
const url = 'mongodb://viaduct.proxy.rlwy.net:17600';
const client = new MongoClient(url);
const dbName = 'users';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to the server');
}

main()
  .then(() => {
    app.use(express.json());

    // ... Previous code ...

// Route handler for /v1/auth/login (POST method)
app.post('/v1/auth/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST requests are allowed.' });
  }

  // Check if both 'username' and 'password' are present in the request body
  if (!username || !password) {
    return res.status(400).json({ error: "Both 'username' and 'password' are required." });
  }

  // Validate the 'username' as a mobile number (you can customize this validation)
  if (!isValidMobileNumber(username)) {
    return res.status(400).json({ error: "Invalid mobile number for 'username'." });
  }

  // Connect to the MongoDB and query the 'auth' collection
  const db = client.db(dbName);
  const collection = db.collection('auth');
  const user = await collection.findOne({ "username": username });

  if (!user) {
    return res.status(404).json({ error: "User doesn't exist." });
  }

  if (user.password !== password) {
    return res.status(403).json({ error: "Incorrect password." });
  }

  res.send('You are in');
});

// ... The rest of your code ...


    // Middleware for /v1/auth/new to ensure required JSON parameters
    app.post('/v1/auth/new', (req, res, next) => {
      const { username, password } = req.body;

      // Check if it's a POST request
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Only POST requests are allowed.' });
      }

      // Check if 'username' and 'password' are present in the request body
      if (!username || !password) {
        return res.status(400).json({ error: "'mobile_number' and 'password' are required." });
      }

      // Validate the 'username' as a mobile number (you can customize this validation)
      if (!isValidMobileNumber(username)) {
        return res.status(400).json({ error: "Invalid mobile number for 'mobile_number'." });
      }

      // If 'username' and 'password' are provided and 'username' is a valid mobile number, continue to the route handler
      next();
    });

    // Route handler for /v1/auth/new (POST method)
    app.post('/v1/auth/new', async (req, res) => {
      const { username, password } = req.body;

      // Insert the username and password into the MongoDB collection
      const db = client.db(dbName);
      const collection = db.collection('auth');
      const insertResult = await collection.insertOne({ "username": username, "password": password });

      res.send('User Registration Successful');
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  })
  .catch(console.error);

// Function to validate mobile number (you can customize this)
function isValidMobileNumber(number) {
  // Implement your mobile number validation logic here
  // For example, check if it's a valid format, length, etc.
  // Return true if it's valid, false otherwise
  // Example implementation:
  const regex = /^[0-9]{10}$/;
  return regex.test(number);
}
