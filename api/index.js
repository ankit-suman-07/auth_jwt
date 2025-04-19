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
        // Generate access token
        const secretKey = 'abstractsecretkey'; // Replace with your own secret key
        const accessToken = jwt.sign({id: user.id, isAdmin: user.isAdmin}, secretKey, {expiresIn: '1h'});
        res.json({
            message: 'SignIn successful',
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
                accessToken: accessToken,
            }
        });
    }else {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    //res.json("Hey, this is working :: " + username);
})

const verify = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if(authHeaders) {
        const token = authHeaders.split(" ")[1];
        jwt.verify(token, 'abstractsecretkey', (error, user) => {
            if(error) {
                return res.status(403).json("Token is not valid");
            } 
            req.user = user;
            next();
        })
    } else {
        res.status(401).json({message: 'You are not authenticated!'});
    }
}

app.delete('/api/users/:userId', verify, (req, res, next) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        res.status(200).json({message: 'User has been deleted!'});
    } else {
        res.status(403).json({message: 'You are not allowed to delete this user!'});
    }
})

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});