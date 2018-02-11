const { checkId, checkUserExists, checkName, checkScore } = require('./validation');

let users = [];


function createUser(params) {
    const { name, score } = params;
    try {
        checkName(name);
        checkScore(score);
        const id = users.length;
        const user = { id, name, score };
        users.push(user);
        return user;
    } catch(error) {
        return null;
    }
}

function readUser(params) {
    try {
        checkId(params.id);
        return users[params.id];
    } catch(error) {
        return null;
    }
}

function updateUser(params) {
    const { id, name, score } = params;
    try {
        checkUserExists(id, users);
        const user = users[id];
        if (name != null) { 
            checkName(name); 
            user.name = name;
        }
        if (score != null) { 
            checkScore(score); 
            user.score = score;
        }
        return user;
    } catch(error) {
        return null;
    }
}

function deleteUser(params) {
    const { id } = params;
    try {
        checkId(id);
        delete users[id];
        return {};
    } catch(error) {
        console.log(error);
        return null;
    }
}


module.exports = { createUser, readUser, updateUser, deleteUser };