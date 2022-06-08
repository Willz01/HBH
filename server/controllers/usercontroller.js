const user_model = require('../schemas/user')

exports.register = async function register(req, res, next) {
    console.log('post')
    const obj = req.body
    console.log(req.body)
    const user_obj = new user_model({
        name: req.body.name,
        email: obj.email
    })
    user_obj.password = user_obj.generateHash(obj.password)

    try {
        const user = await user_obj.save()
        res.send(user)
    } catch (e) {
        let err = e.toString()
        if (e.toString().includes('duplicate')) {
            console.log(e)
            if (err.includes('name_1'))
                res.status(400).json({
                    message: "Username already taken"
                })
            else
                res.status(400).json({
                    message: "Email already taken"
                })
        } else
            res.status(400).json({
                message: e.message
            })
    }
}