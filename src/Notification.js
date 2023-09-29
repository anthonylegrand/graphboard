const fs = require('fs')
const path = require('path')

const TagsList = [ 'warning', 'neutre', 'debug', 'error', 'sucess' ]

class Notification{
    constructor(title, message, options){
        this.title = title
        this.message = message
        this.options = setOptions(options)
    }

    setOptions(options){
        const { tag, important } = options
        if(TagsList.includes(tag) && typeof important === 'boolean'){
            return { tag, important }
        }
        throw 'Invalide notification data'
    }

    write(){

    }

    read(){

    }
}

module.exports = (title, message, options) => {
    return new Notification(title, message, options)
}