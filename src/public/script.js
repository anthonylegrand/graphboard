const charts_list = document.getElementById('charts_list')
const timesType = [{k: 's', v: 60, d: 1000}, {k: 'm', v: 60, d: 60_000}, {k: 'h', v: 24, d: 1_440_000}, {k: 'd', v: 31, d: 44_640_000}]

window.onload = () => {
    fetchGraphs()

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
    })
}

function createGraphElement(key, json){
    const article = createElement('article')

    const header = createElement('header')
    const header_div = createElement('div')
    const header_div_div = createElement('div')
    const header_div_div_h5 = createElement('h5', [{innerHTML: '2 003'}])
    const header_div_div_i = createElement('i', [{innerHTML: '+105%'}])
    const header_div_p = createElement('p', [{innerHTML: 'option'}])
    const label = createElement('label', [{innerHTML: key.replaceAll('_', ' ')}])
    
    const canvas = createElement('canvas', [{ id: 'chart-'+key }])

    article.appendChild(header)
    header.appendChild(header_div)
    header_div.appendChild(header_div_div)
    header_div_div.appendChild(header_div_div_h5)
    header_div_div.appendChild(header_div_div_i)
    header_div.appendChild(header_div_p)
    header.appendChild(label)

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
    return console.log(formatData(json.data))

    const ctx = document.getElementById('chart-'+key);
    new Chart(ctx, {
        type: json.options.type || 'line',
        data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: formatData(json.data)
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function formatData(data){
    const selectedTime = document.getElementById('time-select').value
    const timeType = timesType.find(time => time.k === selectedTime)
    let time = Math.trunc(Date.now()/timeType.d)

    const datas = []
    
    for(let i = 0;i<timeType.v;i++){
        console.log(timeType.k+'-'+(time-i), data[timeType.k+'-'+(time-i)], i)
    }
    
    return datas


    // {
    //     label: 'of Votes',
    //     data: [12, 19, 3, 5, 2, 3],
    //     borderWidth: 1
    // }
}