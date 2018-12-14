const camelcaseObject = require('camelcase-object')

function camelcase(object) {
  if (Array.isArray(object)) {
    return object.map((item) => camelcase(item))
  } else {
    return camelcaseObject(object)
  }
}

module.exports = camelcase