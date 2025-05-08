const jwt = require('jsonwebtoken');
const util = require('util');
const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);
var functions = {};

functions.createToken = async(id, username, fullname) => {
    try {
        const token = await jwtSign(
            {
                id: id,
                username: username,
                fullname: fullname
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

        console.log("Authorized!");
        req.user = decoded;
        return true;
    } catch (error) {
        console.error('Not Authorized!', error);
        return false;
    }
};

module.exports = functions;