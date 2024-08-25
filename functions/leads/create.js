// functions/api.js
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

app.use(express.json());

router.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, user_id: "john_doe_17091999" });
  }

  const numbers = data.filter(item => !isNaN(item)).map(Number);
  const alphabets = data.filter(item => /^[a-zA-Z]$/.test(item));
  const lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());
  const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 
    ? [lowercaseAlphabets.sort().pop()] 
    : [];

  res.json({
    is_success: true,
    user_id: "john_doe_17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123",
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet
  });
});

router.get('/bfhl', (req, res) => {
  res.json({ operation_code: 1 });
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
