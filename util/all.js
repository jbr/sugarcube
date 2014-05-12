SC.util.isSColumns = function(d) {
  return _(d).isObject() &&
    _(d).all(function(value) { return _(value).isArray() }) &&
    _(d).chain().values().pluck('length').unique().value().length === 1
}


SC.util.processData = function() {
  var chart = this
  _(this.data).defaults({ columns: {}, rows: [] })


  
  if (_(this.data.raw).isArray() && SC.util.type(this.data.raw) === 'object') {
    this.data.rows = chart.data.raw.map(function(inRow) {
      var out = {}
      _(chart.aes).each(function(value, name) {
        if (_(value).isString())
          out[name] = inRow[value]
        else out[name] = value
      })
        return out
    })

    _(this.aes).each(function(value, name) {
      chart.data.columns[name] = _(chart.data.rows).pluck(name)
    })
      } else if (_(this.data.raw).isArray()) {
        this.data.columns.x = this.data.raw
        this.aes.x = 'x'
        _(this).defaults({ geom: 'bar', stat: 'bin' })
        this.data.rows = SC.util.columnsToRows(this.data.columns)
      } else if (_(this.data.raw).isObject()) {
        this.data.columns = _(this.aes).reduce(function(columns, value, key) {
          if (_(value).isString()) columns[key] = chart.data.raw[value]
          else columns[key] = value
          return columns
        }, {})

        this.data.rows = SC.util.columnsToRows(this.data.columns)
      }
}

SC.util.deepSet = function(object, key, value) {
  var keyParts = key.split ? key.split(".") : key

  if (keyParts.length === 1) {
    object[keyParts[0]] = value
  } else {
    if (typeof object[keyParts[0]] === 'undefined')
      object[keyParts[0]] = {}

    SC.util.deepSet(object[keyParts[0]], keyParts.slice(1), value)
  }

  return object
}

SC.util.deepGet = function(object, key) {
  var keyParts = key.split ? key.split(".") : key
  if (keyParts.length === 1) return object[keyParts[0]]
  else if (object[keyParts[0]]) return SC.util.deepGet(object[keyParts[0]], keyParts.slice(1))
}

SC.util.deepExtend = function(root) {
  root = root || {}
  _(Array.prototype.slice.call(arguments, 1))
    .each(function(extension) {
      _(extension).each(function(value, key) { SC.util.deepSet(root, key, value) })
        })
      return root
}


SC.util.type = function(data) {
  if (_(data).isArray()) {
    var types = _(data).chain().map(SC.util.type).unique().value()
    if (types.length > 1) throw new Error("elements in an array should be the same type, but were mixed: " + types.join(", "))
    return types[0]
  } else if (_(data).isString()) {
    return 'string'
  } else if (_(data).isNumber()) {
    return 'number'
  } else if (_(data).isObject()) {
    return 'object'
  }
}

SC.util.pad = function(margin, limit) {
  var min = limit[0], max = limit[1]
  ,   range = Math.abs(max - min)
  ,   pad = margin * range

  if (min < max) return [ min - pad, max + pad ]
  else return [ min + pad, max - pad ]
}

SC.util.columnsToRows = function(columns) {
  var columnNames = Object.keys(columns)
  ,   lengths = _(columnNames.map(function(n) {return columns[n].length})).unique()

  if (lengths.length > 1) throw new Error("columns need all to be the same length, but were " +lengths.join(", "))

  return _(lengths[0]).times(function(i) {
    return _(columnNames).reduce(function(row, column) {
      row[column] = columns[column][i]
      return row
    }, {})
  })
}
