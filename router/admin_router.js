const router = require('express').Router()
const {adminController} = require('../controller')

router.post('/add', adminController.getAll )
router.patch('/edit', adminController.getSpecific)

module.exports = router