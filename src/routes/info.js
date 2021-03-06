const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.send({ "api": "work in progress" });
});

module.exports = routes;