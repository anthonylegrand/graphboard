const validate = require('./utils/validate')

const serverWrapper = config => {
    const validatedConfig = validate(config)

    const server = () => {

    }

    return server
}

module.exports = serverWrapper