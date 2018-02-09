const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const app = express();

app.use(bodyParser.json());

let users = [];
const usersEndpoint = '/users/';

function validateName(name) {
    return typeof(name) === typeof("") && name.length > 0 && name.length < 100;
}

function validateScore(score) {
    return typeof(score) === typeof(0) && score >= 0 && score <= 100;
}

function validateId(id) {
    try {
        let i = Number(id);
        return i >= 0;
    } catch(err) {
        return false;
    }
}

function sendError(res, text, status = 400) {
    res.status(status);
    res.json({ error: text });
} 

function validation(user) {
    const { name, score } = user;
    if (!validateName(name)) {
        return name ? `'${name}' is not valid name` : "user must have name";
    }
    if (!validateScore(score)) {
        return score ? `'${score}' is not valid score` : "user must have score";
    }
    return null;
} 

// CREATE
router.post(usersEndpoint, (req, res) => {
    const id = users.length;
    const { name, score } = req.body;
    const newUser = { id, name, score };
    const error = validation(newUser);
    if (error) {
        sendError(res, error);
        return;
    }
    users.push(newUser);
    console.log(`POST: ${JSON.stringify(newUser)}`);
    res.json(newUser);
});

// READ
router.get(usersEndpoint + ':id', (req, res) => {
    let { id } = req.params;
    if (!validateId(id)) {
        sendError(res, `'${id}' is invalid id`);
        return;
    }
    id = Number(id);
    const user = users[id];
    if (!user) {
        sendError(res, `User with id '${id}' not found.`, 404);
        return;
    }
    res.json(user);
});

// UPDATE

// DELETE

app.use('/', router);

app.listen(3000);

console.log("Server started");
