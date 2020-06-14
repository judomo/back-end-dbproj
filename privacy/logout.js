const express = require('express');

const app = express();

app.post('/', async function(req, res) {
    req.session.isUserAuthorized = false;
    req.session.userID = null;
    res.status(200).send({
        isSuccess: true,
    });
});

module.exports = app;
