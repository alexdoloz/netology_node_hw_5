let users = [];


function createUser(params) {
    const { name, score } = params;
    if (typeof(name) !== typeof("") || typeof(score) !== typeof(0)) {
        return null;
    }
    const id = users.length;
    const user = { id, name, score };
    users.push(user);
    return user;
}

function readUser(params) {
    return users[params.id];
}

function updateUser(params) {
    const { id, name, score } = params;
    if (typeof(name) !== typeof("") || typeof(score) !== typeof(0)) {
        return null;
    }
}


module.exports = { createUser, readUser, updateUser };