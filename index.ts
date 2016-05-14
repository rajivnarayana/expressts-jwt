////// <reference path="./typings/main.d.ts" />

import * as express from "express"
import {ACCEPTED, BAD_REQUEST, UNAUTHORIZED} from "http-status-codes"
import * as bodyParser from "body-parser"
import {signup, login, findById} from "./modules/users";
import * as jwt from "jsonwebtoken";
const JWT_SECRET = "my-secret-jwt-key";

const app : express.Application = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (request : express.Request, response : express.Response) => {
    response.status(ACCEPTED).send("Hello World")
})

app.post('/signup', (request : express.Request, response : express.Response, next : (...any)=>{}) => {
    let promise : Promise<string>;
    
    if (!request.body.username || !request.body.password) {
        promise = Promise.reject<Error>(new Error('Username and password required'))
    } else {
        promise = signup(request.body.username, request.body.password).then((user: User) => {
            return jwt.sign({user : user.id}, JWT_SECRET, {expiresIn : '1h'});
        })
    }
    
    promise.then((token : string) => {
        response.status(ACCEPTED).send(token)
    }, next)
})

app.post('/login', (request : express.Request, response : express.Response, next : (...any)=>{}) => {
    let promise : Promise<string>;
    
    if (!request.body.username || !request.body.password) {
        promise = Promise.reject<Error>(new Error('Username and password required'))
    } else {
        promise = login(request.body.username, request.body.password).then((user: User) => {
            return jwt.sign({user : user.id}, JWT_SECRET, {expiresIn : '1h'});
        })
    }
    
    promise.then((result)=>{
        response.status(ACCEPTED).send(result)
    }, next)
})

app.get('/protected', (request : express.Request, response : express.Response, next : (...any)=>{}) => {
    new Promise((resolve, reject) => {
        jwt.verify(request.query.token, JWT_SECRET, {ignoreExpiration: true}, (error, decoded) => {
            if (error) {
                return reject(error)
            }
            resolve(decoded)
        });
    }).then((decoded: {user: string}) => {
        return findById(decoded.user).then((user) => {
            if (!user) throw new Error('No such user exists!')
            return user
        })
    }).then((user: User) => {      
        response.status(ACCEPTED).send(`Hello ${user.username}`)
    }, (error: Error) => {
        response.status(UNAUTHORIZED).send(error.message)
    })
})

app.use((error: Error, request: express.Request, response: express.Response, next: (...any)=>{}) => {
    response.status(BAD_REQUEST).send(error.message)
})

app.listen(3000, () => {
    console.log(`Listening on port ${3000}`)
})