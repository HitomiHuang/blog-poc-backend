const express = require('express')
const router = express.Router()
const responseController = require('../../controllers/response-controller')

router.put('/edit', responseController.putResponse)
router.delete('/delete', responseController.removeResponse)
router.post('/', responseController.addResponse)

module.exports = router
