const charts_list = document.getElementById('charts_list')
const timesType = [{k: 's', v: 60, d: 1000}, {k: 'm', v: 60, d: 60_000}, {k: 'h', v: 24, d: 1_440_000}, {k: 'd', v: 31, d: 44_640_000}]

window.onload = () => {
    fetchGraphs()

    setInterval(() => {
        document.getElementById('progress-bar').classList = ''
        fetchGraphs()
    }, 60_000)

    document.getElementById('time-select')
        .addEventListener('change', () => fetchGraphs())
}

function fetchGraphs(){
    fetch('', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(graphsList => {
        charts_list.innerHTML = ''
        Object.keys(graphsList).map(el => 
            createGraphElement(el, graphsList[el])    
        )

        const childElements = Array.from(charts_list.querySelectorAll('article'))
        childElements.sort((a, b) => {
            const priorityA = parseInt(a.getAttribute('data-priority') || '0', 10);
            const priorityB = parseInt(b.getAttribute('data-priority') || '0', 10);
            return priorityA - priorityB;
        });
        childElements.forEach(child => charts_list.appendChild(child));
        
        document.getElementById('progress-bar').classList = 'full'
    })
}

function createGraphElement(key, json){
    const article = createElement('article')
    article.classList = 'size-'+json.options.size
    article.dataset.priority = json.options.priority

    const header = createElement('header')
    const header_div = createElement('div')
    const header_div_div = createElement('div')
    const header_div_div_h5 = createElement('h5', [{innerHTML: key.replaceAll('_', ' ')}])
    const header_div_option = createElement('button', [{innerHTML: 'Graphics option (in development)'}])
    
    const canvas = createElement('canvas', [{ id: 'chart-'+key }])

    article.appendChild(header)
    header.appendChild(header_div)
    header_div.appendChild(header_div_div)
    header_div_div.appendChild(header_div_div_h5)
    header_div.appendChild(header_div_option)

    
    if(json.absolutValues !== undefined){
        const key_i = Object.keys(json.absolutValues)[0]
        const header_label = createElement('label', [{innerHTML: json.absolutValues[key_i]+' '+key_i}])
        header.appendChild(header_label)
    }

    article.appendChild(canvas)

    charts_list.appendChild(article)

    createChart(key, json)
}

function createElement(element, attributes = []){
    const elem = document.createElement(element)
    attributes.map(attri =>{
        if(Object.keys(attri)[0] === 'innerHTML')
            elem.innerHTML = attri[Object.keys(attri)[0]]
        else
            elem.setAttribute(Object.keys(attri)[0], attri[Object.keys(attri)[0]])
    })
    return elem
}

function createChart(key, json){
    const ctx = document.getElementById('chart-'+key)

    const data = json.options.type === 'doughnut' 
                    ? doughnut_formatData(key, json.data) 
                    : formatData(json.data, json.options.absolute)

    new Chart(ctx, {
        type: json.options.type || 'line',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            maintainAspectRatio: false,
        },
        responsive: true,
    });
}

function doughnut_formatData(label, data){
    const selectedTime = document.getElementById('time-select').value
    const timeType = timesType.find(time => time.k === selectedTime)
    let time = Math.trunc(Date.now()/timeType.d)

    let labels = []
    let datasets = [{
          label,
          data: [],
          hoverOffset: 4
        }]

    for(let i = 0;i<timeType.v;i++){
        let _data = data[timeType.k+'-'+(time-i)]
        if(_data){
            Object.keys(_data).map(key => {
                if(!labels.includes(key)){
                    labels.push(key)
                    datasets[0].data.push(0)
                }

                    let label_i = labels.findIndex(_ => _ === key)
                    datasets[0].data[label_i] += _data[key]
            })
        }
    }

    return {
        labels,
        datasets
      };
}

function formatData(data, isAbsolute){
    const selectedTime = document.getElementById('time-select').value
    const timeType = timesType.find(time => time.k === selectedTime)
    let time = Math.trunc(Date.now()/timeType.d)

    let labels = []
    let datasets = []
    
    for(let i = 0;i<timeType.v;i++){
        labels.push(i+timeType.k)

        let _data = data[timeType.k+'-'+(time-i)]
        if(_data){
            Object.keys(_data).map(key => {
                let _DataLine = datasets.find(dataset => dataset.dataName === key)

                if(!_DataLine){
                    _DataLine = new DataLine(key, isAbsolute, timeType.v)
                    datasets.push(_DataLine)
                }

                _DataLine.addData(i, _data[key])
            })
        }
    }
    
    return {
        labels,
        datasets: datasets.map(dataset => dataset.toJson())
    }
}

class DataLine{
    constructor(dataName, isAbsolute, size){
        this.dataName = dataName
        this.borderWidth = 2
        this.tension = 0.25
        this.spanGaps = true
        this.isAbsolute = isAbsolute
        this.size = size

        this.data = Array(size).fill(isAbsolute ? null : 0)
    }

    addData(index, value){
        this.data[index] = value

        if(this.isAbsolute){
            if(this.data[0] === null)
                this.data[0] = value
        }else if(index+1 < this.size)
            this.data[index+1] = 0
    }

    toJson(){
        let isSequence = false
        const _data = this.data.map((_) => {
            if(_ === 0)
                if(isSequence) return null
                else {
                    isSequence = true
                    return 0
                }
            else{
                isSequence = false
                return _
            }
        })

        return {
            label: this.dataName,
            data: _data,
            borderWidth: this.borderWidth,
            tension: this.tension,
            spanGaps: this.spanGaps
        }
    }
}