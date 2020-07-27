const express = require('express');
const MsauService = require('./service');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();
const bodyParser = express.json();



authRouter
    .route('/login')
    .post(bodyParser, (req, res, next) => {
        const {
            username,
            password
        } = req.body
        MsauService.getLogin(
                req.app.get('db'),
                username,
                password
            )
            .then(codes => {
                // destructuring below
                // let {codes, geom} = codes
                if (!codes) {
                    throw new Error()
                }
                const token = jwt.sign({
                    username
                }, 'ejenghenduyerhsnehcyjeksleodjendy')
                res
                    .status(200)
                    .json({
                        codes: codes,
                        token: token,
                    })
            })
            .catch(next)
    })

authRouter
    .route('/signup')
    .post(bodyParser, (req, res, next) => {
        const {
            firstname,
            lastname,
            email,
            username,
            password,
        } = req.body
        bcrypt.hash(password, 12)
            .then(hashedPw => {
                EmdService.addUser(
                        req.app.get('db'),
                        firstname,
                        lastname,
                        email,
                        username,
                        hashedPw
                    )
                    .then(data => {
                        res
                            .status(201)
                            .json(data)
                    })
                    .catch(next)
            })
    })

module.exports = authRouter;