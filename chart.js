window.C = window.Chart = (function() {
  var C = function() {
    var obj = Object.create(C.proto)
    C.chart.apply(obj, arguments)
    return obj
  }

  C.chart = function(selector, options) {
    this.renders = []
    this.options = C.util.deepExtend({}, options)
    this.aes = {}
    this.data = {}
    this.limits = {}
    this.scales = {}
    this.axes = {}
    this.selector = selector

    var domElement = this.domElement = document.body.querySelector(selector)
    ,   svgHeight = this.svgHeight = Number(domElement.getAttribute('height'))
    ,   svgWidth = this.svgWidth = Number(domElement.getAttribute('width'))
    ,   margin = this.options.margin || {}

    if (_(margin).isNumber()) {
      margin = { top: margin, left: margin, bottom: margin, right: margin }
    }

    _(margin).defaults({
      top: 10,
      left: 50,
      bottom: 50,
      right: 0
    })

    this.margin = margin
    this.width = svgWidth - margin.left - margin.right
    this.height = svgHeight - margin.top - margin.bottom

    this.element = d3.select(selector)
      .append('g')
      .attr('transform', 'translate('+margin.left+','+margin.top+')')

    return this
  }

  C.proto = {}

  C.proto.q = function(options) {
    if (_(options).isArray() || C.util.isColumns(options))
      options = { data: options }
    
    C.util.deepExtend(this.options, options)

    _(this.aes).extend(_(this.options).pick('x', 'y', 'color', 'fill', 'size', 'alpha'),
                       this.options.aes)

    _(this.data).extend({ raw: this.options.data })

    _(this.limits).extend(this.options.limits)

    this.stat = this.options.stat
    this.geom = this.options.geom

    C.util.processData.call(this)

    if (this.stat)
      C.stats[this.stat].call(this)

    C.geoms[this.geom].call(this)
    return this
  }

  C.proto.render = function() {
    var chart = this

    chart.renders.forEach(function(renderer) {
      renderer.call(chart, chart.element)
    })

    return chart
  }




















  C.util = {}

  C.util.isColumns = function(d) {
    return _(d).isObject() &&
      _(d).all(function(value) { return _(value).isArray() }) &&
      _(d).chain().values().pluck('length').unique().value().length === 1
  }


  C.util.processData = function() {
    var chart = this
    _(this.data).defaults({ columns: {}, rows: [] })


    
    if (_(this.data.raw).isArray() && C.util.type(this.data.raw) === 'object') {
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
      this.data.rows = C.util.columnsToRows(this.data.columns)
    } else if (_(this.data.raw).isObject()) {
      this.data.columns = _(this.aes).reduce(function(columns, value, key) {
        if (_(value).isString()) columns[key] = this.data.raw[value]
        else columns[key] = value
        return columns
      }, {})

      this.data.rows = C.util.columnsToRows(this.data.columns)
    }
  }

  C.util.deepSet = function(object, key, value) {
    var keyParts = key.split ? key.split(".") : key

    if (keyParts.length === 1) {
      object[keyParts[0]] = value
    } else {
      if (typeof object[keyParts[0]] === 'undefined')
        object[keyParts[0]] = {}

      C.util.deepSet(object[keyParts[0]], keyParts.slice(1), value)
    }

    return object
  }

  C.util.deepGet = function(object, key) {
    var keyParts = key.split ? key.split(".") : key
    if (keyParts.length === 1) return object[keyParts[0]]
    else if (object[keyParts[0]]) return C.util.deepGet(object[keyParts[0]], keyParts.slice(1))
  }

  C.util.deepExtend = function(root) {
    root = root || {}
    _(Array.prototype.slice.call(arguments, 1))
      .each(function(extension) {
        _(extension).each(function(value, key) { C.util.deepSet(root, key, value) })
      })
    return root
  }


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


  C.stats.jitter = function() {
    var chart = this
    _(['x', 'y']).each(function(column) {
      var extent = d3.extent(chart.data.columns[column])
      ,   range = Math.abs(extent[1] - extent[0])
      ,   jitter = range * 0.05
      ,   random = d3.random.normal(0, jitter)

      chart.data.columns[column] = chart.data.columns[column].map(function(p) {
        return p + random()
      })

      chart.data.rows = C.util.columnsToRows(chart.data.columns)
    })
  }
                      

  
  C.stats.bin = function() {
    var domain

    if (C.util.type(this.data.columns.x) === 'number') {
      if (this.options.bins && this.options.binWidth)
        throw new Error("Please don't supply both bins and binWidth.  It confuses me.")

      var bins = this.options.bins || 6
      ,   min = d3.min(this.data.columns.x)
      ,   max = d3.max(this.data.columns.x)
      ,   binWidth = this.options.binWidth || (Math.abs(max-min) / bins)
      ,   precision = 1 - Math.floor(Math.log(binWidth) / Math.log(10))

      binWidth = d3.round(binWidth, precision)

      domain = _.range(min,max,binWidth).map(function(n) {
        return d3.round(n, precision)
      })

      this.data.columns.x = this.data.columns.x.map(function(d) {
        return _(domain).detect(function(n) { return n <= d && d <= n+binWidth})
      })
    }

    domain = domain || _(this.data.columns.x).unique()

    var counts = _(this.data.columns.x).reduce(function(m, n) {
      m[n] = (m[n] || 0) + 1
      return m
    }, {})

    this.data.columns.x = domain

    this.data.columns.counts = domain.map(function(n) { return counts[n] || 0})

    // if (_(this.data.columns.x).all(function(d) { return d.match(/^[0-9.]+$/) }))
    //     this.data.columns.x = this.data.columns.x.map(Number)

    this.data.columns.y = this.data.columns.counts

    this.data.rows = C.util.columnsToRows(this.data.columns)
    C.util.deepSet(this, 'limits.y.min', 0)
    C.scales.categorical.call(this, 'x', { rangePad: 0, range: [0,this.width] })
  }









  C.scales = {}

  C.scales.pick = function(aesthetic, options) {
    if (this.scales[aesthetic]) return

    if (_(this.aes[aesthetic]).isNumber()) {
      C.scales.identity.call(this, aesthetic, this.aes[aesthetic])
      return
    }

    var scaleType = 'identity'
    ,   columnType = C.util.type(this.data.columns[aesthetic])
    
    if (columnType === 'number') scaleType = 'continuous'
    else if (columnType === 'string') scaleType = 'categorical'

    C.scales[scaleType].call(this, aesthetic, options)
  }
  
  C.scales.categorical = function(aesthetic, options) {
    this.limits[aesthetic] = _(this.data.columns[aesthetic]).unique()
    this.scales[aesthetic] = d3.scale.ordinal().domain(this.limits[aesthetic])

    if ((aesthetic === 'x' || aesthetic === 'y')) {
      _(options).defaults({ rangePad: 0.1 })
      this.scales[aesthetic].rangeBands(options.range, options.rangePad)
    } else {
      this.scales[aesthetic].range(options.range)
    }
  }

  C.scales.continuous = function(aesthetic, options) {
    var extents = d3.extent(this.data.columns[aesthetic])

    if (options && options.pad)
      extents = C.util.pad(options.pad, extents)

    this.limits[aesthetic] = _(this.limits[aesthetic] || {}).defaults({
      min: extents[0],
      max: extents[1]
    })
    
    this.scales[aesthetic] = d3.scale.linear().domain([
      this.limits[aesthetic].min,
      this.limits[aesthetic].max
    ])

    if (options && options.range)
      this.scales[aesthetic].range(options.range)
  }

  C.scales.identity = function(aesthetic, value) {
    if (_(value).isObject()) value = value.defaultValue
    this.scales[aesthetic] = function() { return value }
  }







  C.axis = {}
  C.axis.x = function() {
    if (!this.scales.x) throw new Error("cannot make a x axis without a x scale")
    this.axes.x = d3.svg.axis().orient('bottom').scale(this.scales.x)

    this.renders.push(function xAxis() {
      this.element.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,'+this.height+')')
        .call(this.axes.x)
    })
  }

  C.axis.y = function() {
    if (!this.scales.y) throw new Error("cannot make a y axis without a y scale")
    this.axes.y = d3.svg.axis().orient('left').scale(this.scales.y)

    this.renders.push(function yAxis() {
      this.element.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(this.axes.y)
    })
  }







  C.geoms = {}

  C.geoms.jitter = function() {
    C.stats.jitter.call(this)
    C.geoms.point.call(this)
  }

  C.geoms.histogram = function() {
    C.stats.bin.call(this)
    C.geoms.bar.call(this)
  }

  C.geoms.bar = function() {
    C.scales.pick.call(this, 'x', { range: [0, this.width] })
    C.scales.pick.call(this, 'y', { pad: 0.25, range: [this.height, 0]})
    C.scales.pick.call(this, 'fill', { defaultValue: 'black', range: ['red', 'blue'] })

    C.axis.x.call(this)
    C.axis.y.call(this)

    this.renders.push(function barGeom() {
      var chart = this

      this.element.selectAll('.bar')
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

    C.scales.pick.call(this, 'x', { pad: 0.25, range: [0, this.width] })
    C.scales.pick.call(this, 'y', { pad: 0.25, range: [this.height, 0]})
    C.scales.pick.call(this, 'fill', { defaultValue: 'black', range: ['red', 'blue', 'green'] })
    C.scales.pick.call(this, 'size', { defaultValue: 5, range: [5, 10] })
    C.scales.pick.call(this, 'alpha', { defaultValue: 1, range: [0, 1] })

    C.axis.x.call(this)
    C.axis.y.call(this)

    this.renders.push(function() {
      this.element.selectAll('.point')
        .data(this.data.rows)
        .enter()
        .append('circle')
        .attr('cx', function(d) { return - chart.scales.size(d.size) / 2})
        .attr('cy', function(d) { return - chart.scales.size(d.size) / 2})
        .attr('r', function(d) { return chart.scales.size(d.size) })
        .style('fill', function(d) { return chart.scales.fill(d.fill) })
        .style('opacity', function(d) { return chart.scales.alpha(d.alpha) })
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
