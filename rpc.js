const { ValidationError } = require('./validation');
const procedures = require('./rpc_procedures')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

function getRPCContext(body) {
    const { method, params, id } = body;
    if (body.jsonrpc !== "2.0" ||
        !method ||
        typeof(method) !== typeof("") || 
        (params &&
        typeof(params) !== typeof({})) ||
        (id && [typeof(0), typeof(""), typeof(null)].indexOf(typeof(id)) < 0)
    ) {
        throw new ValidationError("Invalid Request", -32600);
    }
    const procedure = procedures[method];
    if (!procedure) {
        throw new ValidationError("Method not found", -32601);
    }
    return { procedure, params, id };
}

function sendErrorRPCResponse(res, error) {
    res.json({
        jsonrpc: "2.0",
        error: {
            code: error.statusCode,
            message: error.message
        },
        id: null
    });
}

function errorGuard(func) {
    return (req, res) => { 
        try {
            func(req, res);
        } catch(error) {
            sendErrorRPCResponse(res, error);
        }
    }
}

function RPCHandler(req, res) {
    console.log(req.body);
    const rpcContext = getRPCContext(req.body);
    const result = rpcContext.procedure(rpcContext.params);
    if (typeof(rpcContext.id) === typeof(undefined)) {
        // нотификация
        return;   
    }
    if (result === null) {
        throw new ValidationError("Invalid params", -32602);
    }
    res.json({
        jsonrpc: "2.0",
        result,
        id: rpcContext.id
    });
}

app.post('/rpc', errorGuard(RPCHandler));

app.listen(3000);

console.log("Server started");
