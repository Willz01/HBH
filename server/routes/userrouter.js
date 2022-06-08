const express = require("express");
const router = express.Router({ mergeParams: true });

const userController = require('../controllers/usercontroller')


router.post('/register', userController.register)

router.post('/login',)

router.delete('/bye')



module.exports = router