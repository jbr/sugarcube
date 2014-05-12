SC.stats.bin = function() {
  var domain

  if (SC.util.type(this.data.columns.x) === 'number') {
    if (this.options.bins && this.options.binWidth)
      throw new Error("Please don't supply both bins and binWidth.  It confuses me.")

    var bins = this.options.bins || 10
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

  this.data.rows = SC.util.columnsToRows(this.data.columns)
  SC.scales.categorical.call(this, 'x', { rangePad: 0, range: [0,this.width] })
}
