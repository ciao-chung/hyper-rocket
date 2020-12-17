class helper {
  getRecursive(data, key, withoutWarning = false) {
    let result = _cloneDeep(data)
    try {
      let properties = key.split('.')
      if(properties.length == 1) return data[key]
      for(const property of properties) {
        if(result[property] === undefined || result[property] === null) return undefined
        result = result[property]
      }
    } catch (error) {
      if(process.env.NODE_ENV != 'testing') {
        if(!withoutWarning) console.warn(error)
      }
      return undefined
    }
    return result
  }
}

module.exports = new helper()
