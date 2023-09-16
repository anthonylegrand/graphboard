module.exports.pathContains = (array, path) => {
    for (const item of array)
      if (path.includes(item)) 
        return true
    return false
}