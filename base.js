var SC = window.SC = window.Sugarcube = (function() {
  var SC = function() {
    var obj = Object.create(SC.proto)
    SC.chart.apply(obj, arguments)
    return obj
  }

  'geoms stats scales axis proto util'.split(' ')
    .forEach(function(name) { SC[name] = {} })

  SC.chart = function(selector, options) {
    this.renders = []
    this.options = SC.util.deepExtend({}, options)
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


  SC.proto.q = function(options) {
    if (_(options).isArray() || SC.util.isSColumns(options))
      options = { data: options }
    
    SC.util.deepExtend(this.options, options)

    _(this.aes).extend(_(this.options).pick('x', 'y', 'color', 'fill', 'size', 'alpha'),
                       this.options.aes)

    _(this.data).extend({ raw: this.options.data })

    _(this.limits).extend(this.options.limits)

    this.stat = this.options.stat
    this.geom = this.options.geom

    SC.util.processData.call(this)

    if (this.stat)
      SC.stats[this.stat].call(this)

    SC.geoms[this.geom].call(this)
    return this
  }

  SC.proto.render = function() {
    var chart = this

    chart.renders.forEach(function(renderer) {
      renderer.call(chart, chart.element)
    })

    return chart
  }

  SC.scales.pick = function(aesthetic, options) {
    if (this.scales[aesthetic]) return

    if (_(this.aes[aesthetic]).isNumber()) {
      SC.scales.identity.call(this, aesthetic, this.aes[aesthetic])
      return
    }

    var scaleType = 'identity'
    ,   columnType = SC.util.type(this.data.columns[aesthetic])

    if (columnType === 'number') scaleType = 'continuous'
    else if (columnType === 'string') scaleType = 'categorical'
    else if (columnType === 'time') scaleType = 'time'

    SC.scales[scaleType].call(this, aesthetic, options)
  }
  

  SC.axis.x = function() {
    if (!this.scales.x) throw new Error("cannot make a x axis without a x scale")
    this.axes.x = d3.svg.axis().orient('bottom').scale(this.scales.x)

    this.renders.push(function xAxis() {
      this.element.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,'+this.height+')')
        .call(this.axes.x)
    })
  }

  SC.axis.y = function() {
    if (!this.scales.y) throw new Error("cannot make a y axis without a y scale")
    this.axes.y = d3.svg.axis().orient('left').scale(this.scales.y)

    this.renders.push(function yAxis() {
      this.element.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(this.axes.y)
    })
  }

  return SC
})();
