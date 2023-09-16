const express = require("express")

const validate = require('./utils/validate')
const middleware = require('./middleware-wrapper')

const serverWrapper = config => {
    const validatedConfig = validate(config)

    const app = express()
    app.use(middleware())

    app.listen(validatedConfig.port)
}

module.exports = serverWrapper