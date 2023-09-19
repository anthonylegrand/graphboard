const fs = require('fs')
const path = require('path')

global.GraphsValue = {}

const timesType = ['s', 'm', 'h', 'd', 'mo']

module.exports = class GraphValue{
    constructor(graphTitle, filePath, options){
        if(global.GraphsValue[graphTitle])
            Object.assign(this, global.GraphsValue[graphTitle])
        else{
            this.graphTitle = graphTitle
            this.filePath = filePath

            const JSON_FILE = fs.existsSync(filePath) 
                                ? JSON.parse(fs.readFileSync(filePath)) 
                                : {}
            
            this.options = JSON_FILE?.options || options
            if(this.options.absolute)
                this.absoluteValue = JSON_FILE?.absoluteValue || 0
            this.values = JSON_FILE?.values || {}

            global.GraphsValue[graphTitle] = this
        }
    }

    increment(value){
        timesType.map((times, i) => {
            this.values[times+'-'+this._getCurrentDate(times)] = this.get(times)+value
        })

        if(this.options.absolute)
            this.absoluteValue += value
    }

    set(value){
        timesType.map((times, i) => {
            this.values[times+'-'+this._getCurrentDate(times)] = value
        })

        if(this.options.absolute)
            this.absoluteValue = value
    }

    get(filter){
        const defaultvalue = this.options.absolute 
                            ? this.absoluteValue
                            : 0

        return this.values[filter+'-'+this._getCurrentDate(filter)] || defaultvalue || 0
    }

    getJson(){
        this._clean()
        return { options: this.options, value: this.values }
    }

    _clean(){
        let filtered = {}
        Object.keys(this.values)
        .map(el => {
            const keys = el.split('-')

            let decalage = 0
            if([timesType[0], timesType[1]].includes(keys[0]))
                decalage = 60
            else if([timesType[2]].includes(keys[0]))
                decalage = 24

            if(decalage != 0){
                if(this._getCurrentDate(keys[0])-decalage < keys[1])
                    filtered[el] = this.values[el]
            }else{
                filtered[el] = this.values[el]
            }
        })

        this.values = filtered
    }
    
    writeFile(){
        const dirname = path.dirname(this.filePath)
        if(!fs.existsSync(dirname))
            fs.mkdirSync(dirname, { recursive: true })

        this._clean()
        const { values } = global.GraphsValue[this.graphTitle]
        fs.writeFileSync(this.filePath, JSON.stringify({ ...this.options, absoluteValue: this.absoluteValue, values }))
    }

    _getCurrentDate(filter){
        let currentSeconde = Math.trunc(Date.now()/1000)
        let currentMinute = Math.trunc(currentSeconde/60)
        let currentHour = Math.trunc(currentMinute/24)
        let currentDay = new Date().toLocaleString().split(' ')[0]
        let currentMonth = currentDay.split('/')[1]+'/'+currentDay.split('/')[2]

        if(filter === timesType[0])
            return currentSeconde
        else if(filter === timesType[1])
            return currentMinute
        else if(filter === timesType[2])
            return currentHour
        else if(filter === timesType[3])
            return currentDay
        else if(filter === timesType[4])
            return currentMonth
        else
            return [currentSeconde, currentMinute, currentHour, currentDay, currentMonth]
    }
}