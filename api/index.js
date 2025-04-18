const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const users = [
    { id: 1, username: 'John Doe', password: 'john@1234', isAdmin: true },
    { id: 2, username: 'Jane Smith', password: 'jane@1234', isAdmin: false },
];

app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    const user = users.find((user) => {
        return (user.username === username && user.password === password);
    })
    if (user) {
        res.json({
            message: 'SignIn successful',
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin
            }
        });
    }else {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    //res.json("Hey, this is working :: " + username);
})

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});