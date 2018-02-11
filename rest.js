const { checkId, checkUserExists, checkName, checkScore, ValidationError } = require('./validation');
const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const app = express();


app.use(bodyParser.json());
app.use((err, req, res, next) => {
    if (!err) { next(); }
    if (err instanceof SyntaxError) {
        console.log(err);
        res.status(400);
        res.json({ error: "JSON parse error" });
        return;
    }
    res.status(500);
    res.json({ error: "Server error" });
});

let users = [];
const usersEndpoint = '/users/';

function errorGuard(func) {
    return (req, res) => {
        try {
            func(req, res);
        } catch(error) {
            console.log(`Error: ${error}`);
            if (error instanceof ValidationError) {
                res.status(error.statusCode);
                res.json({ error: error.message });
                return;
            }
            res.status(500);
            res.json({ error: "Server error" });
        }
    };
}

// CREATE
router.post(usersEndpoint, errorGuard((req, res) => {
    const id = users.length;
    const { name, score } = req.body;
    checkName(name);
    checkScore(score);
    const newUser = { id, name, score };
    users.push(newUser);
    console.log(`POST: ${JSON.stringify(newUser)}`);
    res.json(newUser);
}));

// READ
router.get(usersEndpoint + ':id', errorGuard((req, res) => {
    const id = +req.params.id;
    checkUserExists(id, users);
    const user = users[id];
    console.log(`GET: id == ${id} -> ${JSON.stringify(user)}`);
    res.json(users[id]);
}));

// UPDATE
router.put(usersEndpoint + ':id', errorGuard((req, res) => {
    const id = +req.params.id;
    checkUserExists(id, users);
    const user = users[id];
    const { name, score } = req.body;
    if (name) { checkName(name); }
    if (score) { checkScore(score); }
    Object.assign(user, { name, score });
    console.log(`PUT: id == ${id} -> ${JSON.stringify(user)}`);
    res.json(user);
}));

// DELETE
router.delete(usersEndpoint + ':id', (req, res) => {
    const id = +req.params.id;
    checkId(id);
    delete users[id];
    console.log(`DELETE: id == ${id}`);
    res.json({});
});

app.use('/', router);
app.listen(3000);

console.log("Server started");
