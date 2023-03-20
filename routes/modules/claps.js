const express = require('express')
const router = express.Router()
const clapController = require('../../controllers/clap-controller')

router.post('/', clapController.addClap)
router.delete('/', clapController.removeClap)

module.exports = router
