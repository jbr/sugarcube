window.C = window.Chart = (function() {
  var C = function() {
    var obj = Object.create(C.proto)
    C.chart.apply(obj, arguments)
    return obj
  }

  C.chart = function(options) {
    this.renders = []
    this.options = options || {}
    this.aes = _(this.options).chain().pick('x', 'y', 'color', 'fill', 'size').extend(options.aes).value()
    this.data = { raw: this.options.data }
    this.limits = {}
    this.scales = {}
    this.axes = {}

    if (_(this.data.raw).isArray() && C.util.type(this.data.raw) === 'object') {
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


  C.proto = {}

  C.proto.render = function(element, margin) {
    var domElement = document.body.querySelector(element)
    ,   svgHeight = Number(domElement.getAttribute('height'))
    ,   svgWidth = Number(domElement.getAttribute('width'))
    if (typeof margin === 'undefined') margin = Math.min(svgHeight, svgWidth) / 10.0
    this.margin = margin
    this.width = svgWidth - (margin * 2)
    this.height = svgHeight - (margin * 2)

    var d3Element = d3.select(element)
        .append('g')
        .attr('transform', 'translate('+margin+','+margin+')')

    this.renders.forEach(_(function(renderer) {
      renderer.call(this, d3Element)
    }).bind(this))

    return this
  }




















  C.util = {}

  C.util.type = function(data) {
    if (_(data).isArray()) {
      var types = _(data).chain().map(C.util.type).unique().value()
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

  C.util.pad = function(margin, limit) {
    var min = limit[0], max = limit[1]
    ,   range = Math.abs(max - min)
    ,   pad = margin * range

    if (min < max) return [ min - pad, max + pad ]
    else return [ min + pad, max - pad ]
  }

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








  C.stats = {}
  C.stats.bin = function() {
    if (C.util.type(this.data.columns.x) === 'string') {
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









  C.scales = {}

  C.scales.pick = function(aesthetic, options) {
    var scaleType = 'identity'
    ,   columnType = C.util.type(this.data.columns[aesthetic])
    
    if (columnType === 'number') scaleType = 'continuous'
    else if (columnType === 'string') scaleType = 'categorical'

    C.scales[scaleType].call(this, aesthetic, options)
  }
  
  C.scales.categorical = function(aesthetic, options) {
    this.limits[aesthetic] = _(this.data.columns[aesthetic]).unique()
    this.scales[aesthetic] = d3.scale.ordinal().domain(this.limits[aesthetic])

    if (options && options.range)
      this.scales[aesthetic].rangeBands(options.range, options.rangePad || 0.1)
  }

  C.scales.continuous = function(aesthetic, options) {
    this.limits[aesthetic] = this.limits[aesthetic] || d3.extent(this.data.columns[aesthetic])

    if (options && options.pad)
      this.limits[aesthetic] = C.util.pad(options.pad, this.limits[aesthetic])

    this.scales[aesthetic] = d3.scale.linear().domain(this.limits[aesthetic])

    if (options && options.range)
      this.scales[aesthetic].range(options.range)
  }

  C.scales.identity = function(aesthetic, value) {
    if (_(value).isObject()) value = value.defaultValue
    this.scales[aesthetic] = function() { return value }
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







  C.geoms = {}

  C.geoms.bar = function() {
    C.axis.x.call(this)
    C.axis.y.call(this)
    this.renders.unshift(function(element) {
      var chart = this
      C.scales.pick.call(this, 'x', { range: [0, this.width] })
      C.scales.pick.call(this, 'y', { pad: 0.25, range: [this.height, 0]})
      C.scales.pick.call(this, 'fill', { defaultValue: 'black', range: ['red', 'blue'] })

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
    C.axis.x.call(this)
    C.axis.y.call(this)

    this.renders.unshift(function(element) {
      C.scales.pick.call(this, 'x', { pad: 0.25, range: [0, this.width] })
      C.scales.pick.call(this, 'y', { pad: 0.25, range: [this.height, 0]})
      C.scales.pick.call(this, 'fill', { defaultValue: 'black', range: ['red', 'blue'] })
      C.scales.pick.call(this, 'size', { defaultValue: 5, range: [5, 10] })


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
          var x = chart.scales.x.rangeBand ?
              chart.scales.x(d.x) + chart.scales.x.rangeBand() / 2 :
              chart.scales.x(d.x)
          return "translate(" + x + ", "+ chart.scales.y(d.y) + ")"
        })
    })
  }

  return C
})()
