const jwt = require('jsonwebtoken');
const util = require('util');
const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);
var functions = {};

functions.createToken = async(id, username, fullname, type) => {
    try {
        const token = await jwtSign(
            {
                id: id,
                username: username,
                fullname: fullname,
                type: type
            },
            "kubernetes",
            { expiresIn: "1h" }
        )
        return token;
    } catch (err) {
        throw err;
    }
};

functions.isAuthorized = async(token, req) => {
    if (!token) {
        console.error('No Token Provided.');
        return false;
    }

    try {
        const decoded = await jwtVerify(token, 'kubernetes', (err, decoded) => {
            if (err) {
                console.error('Not Authorized!');
                return false;
            }
        });

        console.log(decoded);
        const response = await fetch(`http://10.96.18.2/api/users/getUser?username=${decoded.username}`);
        if (!response.ok) { return res.status(500).json({message: 'Ocorreu um Erro: ', error}) }
        const existingUsers = await response.json();
        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            console.log("Authorized!");
            const user = existingUsers[0];
            req.user = {id: user.id, username: user.username, fullname: user.fullname, type: user.type};
            return true;
        }
        return false;
    } catch (error) {
        console.error('Not Authorized!', error);
        return false;
    }
};

module.exports = functions;