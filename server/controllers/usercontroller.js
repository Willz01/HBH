require('dotenv').config()
const jsonWT = require('jsonwebtoken')
const user_model = require('../schemas/user')


let jwt;
exports.register = async function register(req, res, next) {
    console.log('post')
    const obj = req.body
    console.log(req.body)
    const user_obj = new user_model({
        name: obj.name,
        email: obj.email
    })
    user_obj.password = user_obj.generateHash(obj.password)

    try {
        const user = await user_obj.save()
        res.send(extract(user, 0))
        next()
    } catch (e) {
        let err = e.toString()
        if (e.toString().includes('duplicate')) {
            console.error(e.message)
            if (err.includes('name_1'))
                res.status(409).json({
                    message: "Username already taken"
                })
            else
                res.status(409).json({
                    message: "Email already taken"
                })
        } else
            res.status(409).json({
                message: e.message
            })
    }
}


//https://stackoverflow.com/questions/48126135/how-to-allow-user-login-by-either-username-or-email-using-node-js
exports.login = async function login(req, res, next) {
    console.log('Login')
    const obj = req.body
    let name = obj.name
    let email = obj.email
    let cond = !!name ? {name: name} : {email: email};
    console.log(cond)

    user_model.findOne(cond, function (err, user) {
        try {
            if (user.validatePassword(obj.password)) {
                // gen and sign token
                jwt = jsonWT.sign(cond, process.env.JWT_TOKEN)
                res.header('auth-token', jwt).send(extract(user, jwt))
                next()
            } else {
                res.status(400).json({message: "Wrong password"})
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "User account doesn't exist."})
        }

        if (err)
            res.status(400).json({message: "User account doesn't exist. 2"})
    })

}

function extract(user, jwt) {
    if (jwt !== 0) {
        return {
            name: user.name,
            email: user.email,
            dp: user.dp,
            jwt: jwt
        }
    }
    return {
        name: user.name,
        email: user.email,
        dp: user.dp
    }
}

exports.deleteUser = async function deleteUser(req, res, next) {
    const obj = req.body
    let name = obj.name
    let email = obj.email
    let cond = !!name ? {name: name} : {email: email};

    user_model.findOne(cond, function (err, user) {
        if (user != null) {
            user_model.deleteOne(cond, function (err, user) {
                res.status(204).json({message: "User deleted", user: extract(user, 0)})
            })
        } else {
            res.status(400).json({message: "User doesn't exists"})
        }
    })
}