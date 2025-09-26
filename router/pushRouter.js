const express = require('express')
const Router = express.Router()
const {pushHandler} = require('../controller/pushHandler.js')

Router.route('/').post(pushHandler)

module.exports  = Router
