const defaultConfig = require('./default-config')

module.exports = config => {
    if (!config) 
      return defaultConfig

    if(typeof config.path !== 'string')
        if(config.path.startsWith('/'))
            config.path = defaultConfig.path
        else
            throw "The path value in the 'graphsboard' config must begin with /"
    
    if(!Array.isArray(config.ignorePaths))
        config.ignorePaths = defaultConfig.ignorePaths
    else
        config.ignorePaths = config.ignorePaths.filter(el => typeof el === 'string')

    if(typeof config.port !== 'numeric')
        config.port = defaultConfig.port

    return config
}