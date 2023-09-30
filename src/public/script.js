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

    document.getElementById('search_input')
        .addEventListener('input', (e) => {
            filterGraphs(e.target.value.toLocaleLowerCase())
        })

    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') 
            openNav(true)
    });
}

function filterGraphs(filter){
    Array.from(charts_list.querySelectorAll('article')).map(el => {
        const el_name = el.querySelector('header h5').innerHTML.toLocaleLowerCase()
        if(el_name.includes(filter) || filter === '')
            el.style.display = 'block'
        else
            el.style.display = 'none'
    })
}

function fetchGraphs(){
    fetch('', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(result => {
        const graphsList = result.graphs

        setNotifications(result.notifications)

        charts_list.innerHTML = ''
        Object.keys(graphsList).map(el => 
            createGraphElement(el, graphsList[el])    
        )

        const childElements = Array.from(charts_list.querySelectorAll('article'))
        childElements.sort((a, b) => {
            const priorityA = parseInt(a.getAttribute('data-priority') || '0', 10);
            const priorityB = parseInt(b.getAttribute('data-priority') || '0', 10);
            return priorityB - priorityA;
        });
        childElements.forEach(child => charts_list.appendChild(child));
        
        document.getElementById('progress-bar').classList = 'full'
        filterGraphs(document.getElementById('search_input').value.toLocaleLowerCase())
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

function getBadgeIcon(badge){
    switch (badge) {
        case 'sucess':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"> <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/> </svg>`
        
        case 'warning':
            return `<svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 7L12 13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 17.01L12.01 16.9989" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>`
        
        case 'debug':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bug-fill" viewBox="0 0 16 16"> <path d="M4.978.855a.5.5 0 1 0-.956.29l.41 1.352A4.985 4.985 0 0 0 3 6h10a4.985 4.985 0 0 0-1.432-3.503l.41-1.352a.5.5 0 1 0-.956-.29l-.291.956A4.978 4.978 0 0 0 8 1a4.979 4.979 0 0 0-2.731.811l-.29-.956z"/> <path d="M13 6v1H8.5v8.975A5 5 0 0 0 13 11h.5a.5.5 0 0 1 .5.5v.5a.5.5 0 1 0 1 0v-.5a1.5 1.5 0 0 0-1.5-1.5H13V9h1.5a.5.5 0 0 0 0-1H13V7h.5A1.5 1.5 0 0 0 15 5.5V5a.5.5 0 0 0-1 0v.5a.5.5 0 0 1-.5.5H13zm-5.5 9.975V7H3V6h-.5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 0-1 0v.5A1.5 1.5 0 0 0 2.5 7H3v1H1.5a.5.5 0 0 0 0 1H3v1h-.5A1.5 1.5 0 0 0 1 11.5v.5a.5.5 0 1 0 1 0v-.5a.5.5 0 0 1 .5-.5H3a5 5 0 0 0 4.5 4.975z"/> </svg>`
        
        case 'error':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16"> <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/> <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/> </svg>`
    
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16"> <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/> </svg>`
    }
}
function createNotificationElement(notif){
    const article = document.createElement('article')
    const article_div1 = document.createElement('div')
    const article_div2 = document.createElement('div')
    const article_div2_lore = document.createElement('lore')
    const article_div2_label = document.createElement('label')

    article.classList = 'badge '+notif.options.badge
    article_div1.title = notif.options.badge
    article_div1.classList = 'badge'
    article_div1.innerHTML = getBadgeIcon(notif.options.badge)
    article_div2_label.innerHTML = notif.title
    article_div2_lore.innerHTML = notif.message

    
    article_div2.appendChild(article_div2_label)
    article_div2.appendChild(article_div2_lore)

    article.appendChild(article_div1)
    article.appendChild(article_div2)
    return article
}
function setNotifications(notifications){
    const list = document.getElementById('notifications-list')
    list.innerHTML = ""
    notifications.map(notif => {
        list.appendChild( createNotificationElement(notif) )
    })
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

function openNav(closed = false){
    const NAV = document.querySelector('nav')
    if(NAV.className === 'show' || closed) NAV.className = ''
    else NAV.className = 'show'
}