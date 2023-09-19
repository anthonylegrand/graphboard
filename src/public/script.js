window.onload = () => {
    fetch('', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(graphsList => {
        Object.keys(graphsList).map(el => 
            createGraphElement(el, graphsList[el])    
        )
        
    })
}

const charts_list = document.getElementById('charts_list')
function createGraphElement(key, json){
    console.log(key, json)
    const article = createElement('article')

    const header = createElement('header')
    const header_div = createElement('div')
    const header_div_div = createElement('div')
    const header_div_div_h5 = createElement('h5', [{innerHTML: '2 003'}])
    const header_div_div_i = createElement('i', [{innerHTML: '+105%'}])
    const header_div_p = createElement('p', [{innerHTML: 'option'}])
    const label = createElement('label', [{innerHTML: key.replaceAll('_', ' ')}])

    article.appendChild(header)
    header.appendChild(header_div)
    header_div.appendChild(header_div_div)
    header_div_div.appendChild(header_div_div_h5)
    header_div_div.appendChild(header_div_div_i)
    header_div.appendChild(header_div_p)
    header.appendChild(label)

    charts_list.appendChild(article)
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