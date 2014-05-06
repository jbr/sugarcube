

var C = window.Chart = function() {
  var obj = Object.create(C.proto)
  C.chart.apply(obj, arguments)
  return obj
}

C.type = function(data) {
  if (_(data).isArray()) {
    var types = _(data).chain().map(C.type).unique().value()
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

C.util = {}
C.util.columnsToRows = function(columns) {
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

C.chart = function(options) {
  this.renders = []
  this.options = options || {}
  this.aes = _(this.options).chain().pick('x', 'y', 'color', 'fill', 'size').extend(options.aes).value()
  this.data = { raw: this.options.data }
  this.limits = {}
  this.scales = {}
  this.axes = {}

  if (_(this.data.raw).isArray() && C.type(this.data.raw)) {
    this.data.rows = _(this.data.raw).map(_(function(inRow) {
      var out = {}
      _(this.aes).each(_(function(value, name) {
        out[name] = inRow[value]
      }).bind(this))
        return out
    }).bind(this))

    this.data.columns = {}

    _(this.aes).each(_(function(value, name) {
      this.data.columns[name] = _(this.data.raw).pluck(value)
    }).bind(this))
      }

  this.stat = this.options.stat
  if (this.options.stat)
    C.stats[this.stat].call(this)

  this.geom = this.options.geom
  C.geoms[this.geom].call(this)
}

C.stats = {}
C.stats.bin = function() {
  if (C.type(this.data.columns.x) === 'string') {
    var counts = _(this.data.columns.x).reduce(function(m, n) {
      m[n] = (m[n] || 0) + 1
      return m
    }, {})

    this.data.columns.x = Object.keys(counts)
    this.data.columns.counts = this.data.columns.x.map(function(n) { return counts[n] })
    if (! this.data.columns.y)
      this.data.columns.y = this.data.columns.counts

    this.data.rows = C.util.columnsToRows(this.data.columns)
  }
}


C.geoms = {}


C.pad = function(margin, limit) {
  var min = limit[0], max = limit[1]
  ,   range = Math.abs(max - min)
  ,   pad = margin * range

  if (min < max) return [ min - pad, max + pad ]
  else return [ min + pad, max - pad ]
}

C.scales = {}
C.scales.categorical = function(aesthetic, options) {
  this.limits[aesthetic] = _(this.data.columns[aesthetic]).unique()
  this.scales[aesthetic] = d3.scale.ordinal().domain(this.limits[aesthetic])
}

C.scales.continuous = function(aesthetic, options) {
  this.limits[aesthetic] = this.limits[aesthetic] || d3.extent(this.data.columns[aesthetic])

  if (options && options.pad)
    this.limits[aesthetic] = C.pad(options.pad, this.limits[aesthetic])

  this.scales[aesthetic] = d3.scale.linear().domain(this.limits[aesthetic])
}

C.axis = {}
C.axis.x = function() {
  this.axes.x = d3.svg.axis().orient('bottom')

  this.renders.push(function(element) {
    element.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,'+this.height+')')
      .call(this.axes.x)
  })
}

C.axis.y = function() {
  this.axes.y = d3.svg.axis().orient('left')

  this.renders.push(function(element) {
    element.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0,0)')
      .call(this.axes.y)
  })
}


C.scales.identity = function(aesthetic, value) {
  this.scales[aesthetic] = function() { return value }
}

C.geoms.bar = function() {
  var chart = this
  C.scales.categorical.call(this, 'x')
  C.scales.continuous.call(this, 'y', { pad: 0.25 })
  if (this.aes.fill && this.data.columns.fill) {
    C.scales.continuous.call(this, 'fill')
    this.scales.fill.range(['red', 'blue'])
  } else {
    C.scales.identity.call(this, 'fill', 'black')
  }

  C.axis.x.call(this)
  C.axis.y.call(this)

  this.renders.unshift(function(element) {
    this.scales.x.rangeBands([0, this.width], 0.1)
    this.scales.y.range([this.height, 0])
    this.axes.x.scale(this.scales.x)
    this.axes.y.scale(this.scales.y)
    
    element.selectAll('.bar')
      .data(this.data.rows)
      .enter()
      .append('rect')
      .attr('width', chart.scales.x.rangeBand())
      .attr('height', function(d) { return chart.height - chart.scales.y(d.y) })
      .style('fill', function(d) { return chart.scales.fill(d.fill) })
      .attr('class', 'bar')
      .attr('transform', function(d) {
        return "translate(" + chart.scales.x(d.x) + ", "+(chart.scales.y(d.y))+")"
      })
  })
}

C.geoms.point = function() {
  var chart = this

  C.scales.continuous.call(this, 'x', { pad: 0.25 })
  C.scales.continuous.call(this, 'y', { pad: 0.25 })

  if (this.aes.fill && this.data.columns.fill) {
    C.scales.continuous.call(this, 'fill')
    this.scales.fill.range(['red', 'blue'])
  } else {
    C.scales.identity.call(this, 'fill', 'blue')
  }

  if (this.aes.size && this.data.columns.size) {
    C.scales.continuous.call(this, 'size')
    this.scales.size.range([5, 10])
  } else {
    C.scales.identity.call(this, 'size', 5)
  }

  C.axis.x.call(this)
  C.axis.y.call(this)

  this.renders.unshift(function(element) {
    this.scales.x.range([0, this.width])
    this.scales.y.range([this.height, 0])
    this.axes.x.scale(this.scales.x)
    this.axes.y.scale(this.scales.y)

    
    element.selectAll('.point')
      .data(this.data.rows)
      .enter()
      .append('circle')
      .attr('cx', function(d) { return - chart.scales.size(d.size) / 2})
      .attr('cy', function(d) { return - chart.scales.size(d.size) / 2})
      .attr('r', function(d) { return chart.scales.size(d.size) })
      .style('fill', function(d) { return chart.scales.fill(d.fill) })
      .attr('class', 'point')
      .attr('transform', function(d) {
        return "translate(" + chart.scales.x(d.x) + ", "+ chart.scales.y(d.y) + ")"
      })
  })
}

var returnThis = function(fn) { return function() { fn.apply(this, arguments); return this }}
var proto = C.proto = {}

proto.render = returnThis(function(element) {
  var domElement = document.body.querySelector(element)

  var margin = this.margin = 40
  this.width = Number(domElement.getAttribute('width')) - (margin * 2)
  this.height = Number(domElement.getAttribute('height')) - (margin * 2)

  var d3Element = d3.select(element).append('g').attr('transform', 'translate('+margin+','+margin+')')
  this.renders.forEach(_(function(renderer) {
    renderer.call(this, d3Element)
  }).bind(this))
})













