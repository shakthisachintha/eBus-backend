module.exports = function (req, res, next) {

    // 401 unauthorized
    // 403 forbidden

    if (!req.user.isConductor) return res.status(403).send("Access denied");
    next();
}