const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const validate = require('./utils/validate')
const utils = require('./utils/utils')
const Graph = require('./Graph')

require('./utils/checkUpdate')

const middlewareWrapper = config => {
    const validatedConfig = validate(config)

    let htmlContent = fs.readFileSync(path.join(__dirname, '/public/index.html')).toString()
    const render = Handlebars.compile(htmlContent)

    const middleware = (req, res, next) => {
        // Send Dashboard
        if (req.path === validatedConfig.path) {
            if(req.method === 'GET'){
                const data = {
                    script: fs.readFileSync(path.join(__dirname, '/public/script.js')),
                    style: fs.readFileSync(path.join(__dirname, '/public/style.css')),
                    style_reset: fs.readFileSync(path.join(__dirname, '/public/reset.css'))
                  }
    
                res.setHeader('Content-Type', 'text/html')
                res.send(render(data))
                return
            }else if(req.method === 'POST'){
                let result = {}
                Graph.graphsList().map(graph => {
                    const graphTitle = graph.replace('.json', '')
                    result[graphTitle] = Graph(graphTitle)._readFile().getJSON()
                })
                res.json(result)
            }
        }else if(validatedConfig.expressGraph && !utils.pathContains(validatedConfig.ignorePaths, req.path)){
            const Express_Graph = Graph('Express Requests', {priority: 50, size: 2})
            const Express_Status = Graph('Express Status', {type: 'doughnut', priority: 50, size: 1})
            Express_Graph.add({incoming: 1})

            res.on("finish", () => {
                if(res.getHeader('x-content-type-options') === undefined)
                    Express_Graph.add({ answered: 1 })
                Express_Status.add({ [res.statusCode]: 1 })
            })
        }
        
        next()
    }

    return middleware
}

module.exports = middlewareWrapper