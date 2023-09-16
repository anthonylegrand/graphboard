const validate = require('./utils/validate')

const middlewareWrapper = config => {
    const validatedConfig = validate(config)

    const middleware = (req, res, next) => {
        next()
    }

    return middleware
}

module.exports = middlewareWrapper