
function hasAll(set, keys) {
  return keys.every(function (k) {
    return !!set[k]
  })
}

function isString (s) {
  return 'string' === typeof s
}

function isEmpty (e) {
  for(var k in e) return false
  return true
}

var apply = require('./apply')

function keys (obj) {
  return obj ? Object.keys(obj) : []
}

//perform a single pass over the modules,
//and satisify ever module which can now be resolved
//with the current sockets.

//apply this function repeatedly, until either there are
//no more plugs, or there was a pass which did not satisfy anything.

function eachPlug(gives, plugs, iter) {
  if(isString(gives))
    iter(gives, plugs)
  else
    for(var k in module.gives)
      iter(k, plugs[k], gives[k])

}

function append(obj, key, value) {
  obj[key] = (obj[key] || []).concat(value)
}

function setup(sockets, needs) {
  var _sockets = {}
  if(isString(needs)) {
    var name = parts[0]
    var type = parts[1]
    return apply[type](sockets[name])
  }
  else {

  }
}

function satisfy(sockets, module, ary) {
  var added = false
  if(!module.needs) {
    append(ary, module.gives, module.create())
    return true
  }
  else if(hasAll(sockets, keys(module.needs))) {
    var _sockets = {}
    keys(module.needs).forEach(function (name) {
      _sockets[name] = apply[module.needs[name]](sockets[name])
    })
    eachPlug(module.gives, module.create(_sockets), function (name, fn) {
      append(ary, name, fn)
    })
    return true
  }
  return false
}

function filter(modules, fn) {
  if(Array.isArray(modules))
    return modules.filter(fn)
  var o = {}
    for(var k in modules)
      if(fn(modules[k], k, modules))
        o[k] = modules[k]
  return o
}

module.exports  = function combine () {
  //iterate over array, and collect new plugs which are satisfyable.

  var modules = [].slice.call(arguments).reduce(function (a, b) {
    for(var k in b)
      if(!b[k]) delete a[k]
      else      a[k] = b[k]
    return a
  }, {})

  var sockets = {}
  while (true) {
    var newSockets = {}
    var _modules = modules
    modules = filter(modules, function (module) {
      return !satisfy(sockets, module, newSockets)
    })

    if(isEmpty(newSockets))
      throw new Error('could not resolve all modules')
    else
      for(var k in newSockets)
        append(sockets, k, newSockets[k])

    if(isEmpty(modules))
      return sockets
  }

}



