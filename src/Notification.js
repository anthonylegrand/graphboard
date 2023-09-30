const fs = require('fs')
const path = require('path')

const TagsList = [ 'neutre', 'warning', 'debug', 'error', 'sucess' ]

class Notification{
    constructor(title, message, options){
        this.title = title
        this.message = message
        this.options = this._setOptions(options)

        this._writeFile()
    }

    _setOptions(options = {}){
        let { badge, important } = options
        if(!badge || !TagsList.includes(badge))
            badge = TagsList[0]
        if(!important || typeof important !== 'boolean')
            important = false

        return { badge, important }
    }

    _writeFile(){
        const dirname = path.join(global.ABSOLUTE_PATH, 'graphsboard')
        if(!fs.existsSync(dirname))
                fs.mkdirSync(dirname, { recursive: true })

        const _json = { at: Date.now(), title: this.title, message: this.message, options: this.options }
        const array = [_json, ...readFile()]
        fs.writeFileSync(path.join(dirname, 'Notifications.json'), JSON.stringify(array))
    }
}

function readFile() {
    const FilePath = path.join(global.ABSOLUTE_PATH, 'graphsboard', 'Notifications.json')
    if(fs.existsSync(FilePath))
        return JSON.parse( fs.readFileSync(FilePath) ).slice(0, 9)
    return []
}

module.exports = (title, message, options) => {
    return new Notification(title, message, options)
}

module.exports.getAll = readFile