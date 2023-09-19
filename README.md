[![graphsboard on npm](https://img.shields.io/npm/v/graphsboard.svg)](https://www.npmjs.com/package/graphsboard)
[![npm](https://img.shields.io/npm/dt/graphsboard.svg)](https://img.shields.io/npm/dt/graphsboard.svg)

## Development in progress
```
The development of this project is ongoing, new vertions are published every day.
```
<br/><br/>

Self-host your own monitoring dashboard for your application. 
Create your own statistics for your dashboard.

## Installation & setup
1. Run 
```shell
    npm i graphsboard --save
```
2. If you don't use express
```javascript
    const graphsboard = require('graphsboard')
    graphsboard.server()
```
2. If you use express add middleware
```javascript
    const express = require("express")
    const app = express()

    // Add this line before all other middleware
    const graphsboard = require('graphsboard')
    app.use(graphsboard.middleware())

    app.listen(80, () => {
        console.log(`Express server is running : http://localhost/`)
    })
```
3. Visit http://ServerIP/graphsboard

Note: This plugin works on Node versions > 4.x

## Configuration
You can change the default configuration:
```javascript
    const config = {
        path: '/custom',
        ignorePaths: [ '/staff' ],
        port: 8080,
    }
    
    // Exemple 1
    graphsboard.server(config)
    // Exemple 2
    app.use(graphsboard.middleware(config))
```

Default config:
```javascript
    path: '/graphsboard',
    ignorePaths: [ '/public', '/admin' ],
    port: 80,
```

Recovered Data:
- `path` : You can change the panel access path <br/>
- `ignorePaths` : If you use Express, you can disable statistics for certain requests <br/>
- `port` : You can change the server's exposure port <br/>

## How to use
Simply add new graphics and data

```javascript
    const graphsboard = require('graphsboard')
    const graph = graphsboard.graph('Total Users', {
        type: 'line', // Default: 'line' - List : ['line', 'bar', 'polararea', 'doughnut', 'radar']
        absolute: true
    })
    graph.increment()

    let pingValue = 800
    const graph = graphsboard.graph('Average Ping ', {
        type: 'line'
        min: 0,
        max: 1000
    })
    graph.set(pingValue)
```
Graph options :
- `type`: Change graph display type
    - **default**: "line"
    - **options**: [ 'line', 'bar', 'polararea', 'doughnut', 'radar' ]
- `absolute`: Does the value continue to increment infinitely? Or does it return to 0 every new minute?
    - **default**: false
- `min`: Set a minimum value for graph display
- `max`: Set a maximum value for graph display

