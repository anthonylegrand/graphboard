const path = require('path')

const GraphValue = require('./utils/GraphValue')

const ABSOLUTE_PATH = __dirname.includes('node_modules') 
                        ? path.normalize(__dirname.split('node_modules')[0]) 
                        : path.join(__dirname, '../')

class Graph{
    constructor(title, options = {}){
        this.title = title
        this.filePath = path.join(ABSOLUTE_PATH, 'graphsboard', title.replaceAll(' ', '_')+'.json')
        this.timeout = null

        this.GraphValue = new GraphValue(title, this.filePath, validOptions(options))
    }

    increment(value = 1){
        this.GraphValue.increment(value)
        this._writeFile()
    }

    decrement(value = 1){
        this.GraphValue.increment(value*-1)
        this._writeFile()
    }

    set(value = 0){
        if(!value) return
        this.GraphValue.set(value)
        this._writeFile()
    }

    _writeFile(){
        if(this.timeout === null)
            this.timeout = setTimeout(()=>{
                this.timeout = null
                this.GraphValue.writeFile()
            }, 1000+Math.trunc(Date.now()%1000))
    }
}

const validOptions = options => {
    if(options.absolute === undefined)
        options.absolute = false

    if(!['line', 'bar', 'polararea', 'doughnut', 'radar'].includes(options.type))
        options.type = 'line'

    if(options.min === undefined)
        options.min = 0

    if(options.max === undefined)
        options.max = 0

    return options
}

/**
 * @param {string} title The date
 * @param {json} options The string
*/
module.exports = (title, options) => {
    return new Graph(title, options)
}