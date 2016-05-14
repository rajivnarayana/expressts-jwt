////// <reference path="./typings/main.d.ts" />

import * as express from "express";
import {ACCEPTED} from "http-status-codes";
const app : express.Application = express();

app.get('/', (request : express.Request, response : express.Response) => {
    response.status(ACCEPTED).send("Hello World");
});

app.listen(3000, () => {
    console.log(`Listening on port ${3000}`);
})