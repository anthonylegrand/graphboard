const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const validate = require('./utils/validate')
const utils = require('./utils/utils')

require('./utils/checkUpdate')

const middlewareWrapper = config => {
    const validatedConfig = validate(config)

    let htmlContent = fs.readFileSync(path.join(__dirname, '/public/index.html')).toString()
    const render = Handlebars.compile(htmlContent)

    const middleware = (req, res, next) => {
        // Send Dashboard
        if (req.path === validatedConfig.path) {
            const data = {
                script: fs.readFileSync(path.join(__dirname, '/public/script.js')),
                style: fs.readFileSync(path.join(__dirname, '/public/style.css'))
              }

            res.setHeader('Content-Type', 'text/html')
            res.send(render(data))
            return
        }else if(!utils.pathContains(validatedConfig.ignorePaths, req.path)){
            
        }
        
        next()
    }

    return middleware
}

module.exports = middlewareWrapper