const fs = require('fs')
const path = require('path')

const {GraphTime, GraphData} = require('./utils/GraphTime')

const ABSOLUTE_PATH = __dirname.includes('node_modules') 
                        ? path.normalize(__dirname.split('node_modules')[0]) 
                        : path.join(__dirname, '../')

let instances = []

class Graph{
    constructor(title, options = {}){
        const existingInstance = instances.find(instance => instance.infos.title === title);
        if(existingInstance)
            return existingInstance

        this.infos = { title, displaySize: 1 }
        this.options = this._validOptions(options)
        this._readFile()

        instances.push(this);
        return this
    }

    add(newData = {}){
        if(typeof newData !== 'object' || Array.isArray(newData)) throw 'Added data format cannot be added to chart'
        this.data = new GraphTime(this.data, this.absolutValues || {})
                        .setAbsolute(this.options.absolute)
                        .add(newData)
                        .getResult()

        if(this.options.absolute)
            this.absolutValues = new GraphData(this.absolutValues).add(newData).getJson()
            
        this._writeFile()
    }

    getJSON(){
        return { infos: this.infos.all, options: this.options, absolutValues: this.absolutValues, data: this.data }
    }

    _writeFile(){
        if(this.timeout !== undefined) return

        const dirname = path.dirname(this._getFilePath())
        if(!fs.existsSync(dirname))
            fs.mkdirSync(dirname, { recursive: true })

        this.timeout = setTimeout(() => {
            let writeJson = {}
            Object.keys(this.data).map(key => {
                if(!key.startsWith('s'))
                    writeJson[key] = this.data[key]
            })

            fs.writeFileSync(this._getFilePath(), JSON.stringify({ ...this.getJSON(), data: writeJson }))
            this.timeout = undefined
        }, 2000);
    }

    _readFile(){
        let file = {}
        if(fs.existsSync( this._getFilePath() ))
            file = JSON.parse( fs.readFileSync(this._getFilePath()) )
        
        this.data = file?.data || {}

        if(this.options.absolute)
            this.absolutValues = file?.absolutValues
        
        return this
    }

    _getFilePath(){
        return path.join(ABSOLUTE_PATH, 'graphsboard', this.infos.title.replaceAll(' ', '_')+'.json')
    }

    _validOptions(options){
        if(options.absolute === undefined)
            options.absolute = false
    
        if(!['line', 'bar', 'polararea', 'doughnut', 'radar'].includes(options.type))
            options.type = 'line'
    
        return options
    }
}

/**
 * @param {string} title The date
 * @param {json} options The string
*/
module.exports = (title, options) => {
    return new Graph(title, options)
}

module.exports.graphsList = () => {
    return fs.readdirSync(path.join(ABSOLUTE_PATH, 'graphsboard'))
}