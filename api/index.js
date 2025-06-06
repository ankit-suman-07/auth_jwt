const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const users = [
    { id: 1, username: 'John Doe', password: 'john@1234', isAdmin: true },
    { id: 2, username: 'Jane Smith', password: 'jane@1234', isAdmin: false },
];

let refreshTokens = [];

app.post("/api/refresh", (req, res) => {
    //  take the refresh token from user
    const refreshToken = req.body.token;

    // send error if there is no token or invalid token
    if(!refreshToken) return res.status(401).json("You are not authenticated!")
    if(!refreshTokens.includes(refreshToken)) return res.status(403).json("Refresh token is not valid!")

    jwt.verify(refreshToken, 'abstractrefreshsecretkey', (error, user) => {
        error && console.log(error);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken); // remove the used refresh token from the array
        const newAccessToken = generateAccessToken({id: user.id, isAdmin: user.isAdmin});
        const newRefreshToken = generateRefreshToken({id: user.id, isAdmin: user.isAdmin});
        refreshTokens.push(newRefreshToken); // add the new refresh token to the array

        res.status(200).json({accessToken: newAccessToken, refreshToken: newRefreshToken});
    })

    // if everything is okay then create a new access token, refresh token and send to user

})

const generateAccessToken = (user) => {
    const secretKey = 'abstractsecretkey'; // Replace with your own secret key
    return jwt.sign({id: user.id, isAdmin: user.isAdmin}, secretKey, {expiresIn: '1h'});
}

const generateRefreshToken = (user) => {
    const refreshSecretKey = 'abstractrefreshsecretkey'; // Replace with your own secret key
    return jwt.sign({id: user.id, isAdmin: user.isAdmin}, refreshSecretKey);
}

app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    const user = users.find((user) => {
        return (user.username === username && user.password === password);
    })
    if (user) {
        // Generate access token

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken); // Store the refresh token in the array

        res.json({
            message: 'SignIn successful',
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
                accessToken: accessToken,
                refreshToken: refreshToken
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

app.post("/api/logout", verify, (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken); // remove the used refresh token from the array
    res.status(200).json("You logged out successfully.");
})

app.delete('/api/users/:userId', verify, (req, res) => {
    const userIdFromToken = req.user.id;
    const userIdToDelete = req.params.userId;
    console.log(userIdFromToken)
    console.log(userIdToDelete)

    if (userIdFromToken + "" === userIdToDelete + "" || req.user.isAdmin) {
        return res.status(200).json({ message: 'User has been deleted!' });
    } else {
        return res.status(403).json({ message: 'You are not allowed to delete this user!' });
    }
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});