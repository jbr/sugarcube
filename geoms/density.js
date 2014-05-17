SC.geoms.density = function() {
  SC.util.deepSet(this, 'limits.y.min', 0)
  SC.scales.pick.call(this, 'x', { range: [0, this.width] })

  var data = this.data.columns.x

  this.data.columns.x = this.scales.x.ticks(500)
  this.data.columns.y = this.data.columns.x.map(function(x) {
    var scale = 10
    ,   sample = data
    ,   kernel = function(u) { return Math.abs(u /= scale) <= 1 ? .75 * (1 - u * u) / scale : 0 }
    return d3.mean(sample, function(v) { return kernel(x - v) })
  })

  this.data.rows = SC.util.columnsToRows(this.data.columns)
  this.options.ylab = "kernel density of " + this.aes.x
  SC.geoms.line.call(this)
}
