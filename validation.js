class ValidationError extends Error {
    constructor(message = "", statusCode = 400, ...args) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}

function invalid(value, name) {
    return `${value} is invalid ${name}`;
}

function checkId(id) {
    if (Number.isInteger(id) && id >= 0) { return; }
    throw new ValidationError(invalid(id, "id"));
}

function checkUserExists(id, users) {
    checkId(id);
    if (users[id]) { return; }
    throw new ValidationError(`User with id ${id} not found.`, 404);
}

function checkName(name) {
    if (typeof(name) === typeof("") && 
        name.length > 3 && 
        name.length < 100) { return; }
    throw new ValidationError(invalid(name, "name"));
}

function checkScore(score) {
    if (typeof(score) === typeof(0) && score >= 0 && score < 999999) {
        return;
    }
    throw new ValidationError(invalid(score, "score"));
}

module.exports = { checkId, checkUserExists, checkName, checkScore, ValidationError };