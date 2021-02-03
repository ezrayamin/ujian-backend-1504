const router = require('express').Router()
const {moviesController} = require('../controller')

router.get('/get/all', moviesController.getAll )
router.get('/get', moviesController.getSpecific)

module.exports = router