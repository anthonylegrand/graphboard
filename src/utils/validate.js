const defaultConfig = require('./default-config')

const validatePath = (path) => {
    if (typeof path !== 'string' || !path.startsWith('/')) {
        throw new Error("The path value in the 'graphsboard' config must be a string and begin with /");
    }
    return path;
}

const validateIgnorePaths = (ignorePaths) => {
    if (!Array.isArray(ignorePaths)) {
        return defaultConfig.ignorePaths;
    }
    return ignorePaths.filter(el => typeof el === 'string');
}

const validatePort = (port) => {
    if (typeof port !== 'number') {
        return defaultConfig.port;
    }
    return port;
}

module.exports = (config = {}) => {
    return {
        path: validatePath(config.path || defaultConfig.path),
        ignorePaths: validateIgnorePaths(config.ignorePaths),
        port: validatePort(config.port),
        expressGraph: config.expressGraph ?? defaultConfig.expressGraph
    }
}