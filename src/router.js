const express = require('express');
const MsauService = require('./service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MsauRouter = express.Router();
const bodyParser = express.json();

MsauRouter
    .route('/code')
    .post(bodyParser, (req, res, next) => {
        const {
            username,
            password
        } = req.body
        console.log(req.body)
        MsauService.getCodeGeom(
            req.app.get('db'),
            username,
            password
        )
            .then(data => {
                res
                    .status(201)
                    .json(data)
            })
            .catch(next)
    })

MsauRouter
    .route('/submit')
    .post(bodyParser, (req, res, next) => {
        const {
            drawGeom,
            buffer
        } = req.body
        console.log(req.body)
        MsauService.editSubmission(
            req.app.get('db'),
            drawGeom,
            buffer
        )
            .then((editSubmissionRes) => {
                console.log('RETURNING EDIT SUBMISSION');
                console.log(editSubmissionRes);
                res.status(201).json({ msg: 'SUCCESS' });
            })
            .catch(next)
    })

// need to get the codes based on user upon logging in and match
// those codes to grab the geom for each one

module.exports = MsauRouter;