const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const secret = process.env.JWT_ACCESS_SECRET;
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.json({tokenFailed:true})
        }
        const userID = jwt.verify(token, secret)
        req.userData = userID
        next()
    } catch (e) {
        return res.json({tokenFailed:true})
    }
};
