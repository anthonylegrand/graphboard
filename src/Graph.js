const fs = require('fs')
const path = require('path')

const {GraphTime, GraphData} = require('./utils/GraphTime')

let instances = []

class Graph{
    constructor(title, options = {}){
        const existingInstance = instances.find(instance => instance.infos.title === title);
        if(existingInstance){
            if(Object.keys(options) > 0)
                existingInstance.options = {...existingInstance.options, ...this._validOptions(options)}
            return existingInstance
        }

        this.infos = { title, displaySize: 1 }
        this._readFile()
        this.options = this._validOptions({...this.options, ...options})

        instances.push(this);
        return this
    }

    add(newData = {}){
        if(typeof newData !== 'object' || Array.isArray(newData)) throw 'Added data format cannot be added to chart'
        this.data = new GraphTime(this.data, this.absolutValues || {})
                        .setAbsolute(this.options.absolute)
                        .setARGV(this.options.argv)
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

            fs.writeFileSync(this._getFilePath(), JSON.stringify({ ...this.getJSON(), options: this.options, data: writeJson }))
            this.timeout = undefined
        }, 2000);
    }

    _readFile(){
        let file = {}
        if(fs.existsSync( this._getFilePath() ))
            file = JSON.parse( fs.readFileSync(this._getFilePath()) )
        
        this.data = file?.data || {}

        this.options = this._validOptions({...file?.options, ...this.options})
        
        if(this.options?.absolute || false)
            this.absolutValues = file?.absolutValues
        
        return this
    }

    _getFilePath(){
        return path.join(global.ABSOLUTE_PATH, 'graphsboard', this.infos.title.replaceAll(' ', '_')+'.json')
    }

    _validOptions(options){
        if(options.absolute === undefined)
            options.absolute = false

        if(options.argv === undefined)
            options.argv = false
    
        if(!['line', 'bar', 'polararea', 'doughnut', 'radar'].includes(options.type))
            options.type = 'line'

        if(options.size === undefined || ![1,2,3].includes(options.size))
            options.size = 1

        if(options.priority === undefined || options.priority < 1)
            options.priority = 1

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
    const dirname = path.join(global.ABSOLUTE_PATH, 'graphsboard')
    if(!fs.existsSync(dirname))
            fs.mkdirSync(dirname, { recursive: true })
        
    return fs.readdirSync(dirname).filter(graph => graph !== 'Notifications.json')
}