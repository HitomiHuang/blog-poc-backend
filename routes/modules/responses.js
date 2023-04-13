const express = require('express')
const router = express.Router()
const responseController = require('../../controllers/response-controller')

router.put('/', responseController.putResponse)
router.delete('/', responseController.removeResponse)
router.post('/', responseController.addResponse)

module.exports = router
