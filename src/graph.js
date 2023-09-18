const fs = require('fs')
const path = require('path')

const ABSOLUTE_PATH = __dirname.includes('node_modules') 
                        ? path.normalize(__dirname.split('node_modules')[0]) 
                        : path.join(__dirname, '../')

class Graph{
    constructor(title, options = {}){
        this.title = title
        this.options = validOptions(options)
        
        this.filePath = path.join(ABSOLUTE_PATH, 'graphsboard', this.title.replaceAll(' ', '_')+'.json')
        this._writeFile()
    }

    increment(value = 1){
        
    }

    decrement(value = 1){
        
    }

    set(value = 0){

    }

    get(){

    }

    _setValue(){
        
    }

    _writeFile(){
        const dirname = path.dirname(this.filePath)
        if(!fs.existsSync(dirname))
            fs.mkdirSync(dirname, { recursive: true })

        fs.writeFileSync(this.filePath, JSON.stringify({}))
    }
}

const validOptions = options => {
    if(options.absolute === undefined)
        options.absolute = false

    if(!['line', 'bar', 'polararea', 'doughnut', 'radar'].includes(options.type))
        options.type = 'line'

    return options
}

/**
 * @param {string} title The date
 * @param {json} options The string
*/
module.exports = (title, options) => {
    return new Graph(title, options)
}