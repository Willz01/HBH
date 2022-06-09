const express = require("express");
const router = express.Router({ mergeParams: true });

const userController = require('../controllers/usercontroller')


router.post('/register', userController.register)

router.post('/login', userController.login)

router.delete('/bye', userController.deleteUser)



module.exports = router