const pjson = require('./../../package.json');

fetch('https://registry.npmjs.org/'+pjson.name)
.then(res => res.json())
.then(json => {
    if(pjson.version === json['dist-tags']?.latest) return
    if(pjson.version === json['dist-tags']?.development) return

    console.log(' ')
    console.log('------------------[RestAPI_Dashboard]------------------')
    console.log('You\'re not using the last version')
    console.log('Do "npm update '+pjson.name+'" to get the new features')
    console.log('------------------------------------------------------')
    console.log(' ')
})
.catch(err =>console.error('[ERROR] Graphsboard: Not Found fetch update'))