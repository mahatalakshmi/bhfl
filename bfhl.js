const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.post('/', (req, res) => {
    const { data, full_name, dob, email, roll_number } = req.body;

    if (!full_name || !dob || !email || !roll_number || !Array.isArray(data)) {
        return res.status(400).json({
            is_success: false,
            message: 'Invalid input',
        });
    }

    const user_id = `${full_name.replace(/\s+/g, '_')}_${dob.replace(/-/g, '')}`;

    const numbers = [];
    const alphabets = [];
    let highest_lowercase = '';

    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (typeof item === 'string') {
            alphabets.push(item);
            if (item === item.toLowerCase() && item > highest_lowercase) {
                highest_lowercase = item;
            }
        }
    });

    res.json({
        is_success: true,
        user_id: user_id,
        email: email,
        roll_number: roll_number,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highest_lowercase ? [highest_lowercase] : []
    });
});

router.get('/', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.use('/.netlify/functions/bfhl', router);

module.exports.handler = serverless(app);
