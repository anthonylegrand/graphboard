const timesType = [{k: 's', v: 1000}, {k: 'm', v: 60}, {k: 'h', v: 24}, {k: 'd', v: 31}]

class GraphTime{
    constructor(data, absolutValues){
        this.data = data
        this.absolutValues = absolutValues
        return this
    }

    setAbsolute(isAbsolute){
        this.isAbsolute = isAbsolute
        return this
    }

    add(newData){
        this._getCurrentDate().map(currentData => {
            this.data[currentData] = new GraphData(this.data[currentData], this.absolutValues)
                                        .add(newData)
                                        .getJson()
        })
        return this
    }

    getResult(){
        this._clean()
        return this.data
    }

    _clean(){
        let cleaned = {}

        const currentDate = this._getCurrentDate()
        Object.keys(this.data).map(key => {
            let a = key.split('-')

            currentDate.map((date, i) => {
                let b = date.split('-')
                if(a[0] === b[0])
                    if((b[1] - a[1]) < [60,60,24,31][i])
                        cleaned[key] = this.data[key]
            })
        })

        this.data = cleaned
    }


    _getCurrentDate(){
        let value = Date.now()
        return timesType.map((time, i) => {
            value = Math.trunc(value/time.v)
            return time.k+'-'+value
        })
    }
}

class GraphData{
    constructor(data = {}, defaultValue = {}){
        this.data = data
        this.defaultValue = defaultValue
    }

    add(newData){
        Object.keys(newData).map(k => {
            if(this.data[k])
                this.data[k] += newData[k]
            else
                this.data[k] = this._getDefaultValue(k) + newData[k]
        })
        return this
    }

    getJson(){
        return this.data
    }

    _getDefaultValue(k){
        return this.defaultValue[k] || 0
    }
}

module.exports = { GraphData, GraphTime }