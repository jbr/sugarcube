SC.scales.time = function(aesthetic, options) {
  SC.util.cast.call(this, aesthetic, 'time')

  var extents = d3.extent(this.data.columns[aesthetic])

  if (options && options.pad) {
    extents = SC.util.pad(options.pad, extents.map(Number))
      .map(function(d) {return new Date(d)})
  }

  this.limits[aesthetic] = _(this.limits[aesthetic] || {}).defaults({
    min: extents[0],
    max: extents[1]
  })
  
  this.scales[aesthetic] = d3.time.scale().domain([
    this.limits[aesthetic].min,
    this.limits[aesthetic].max
  ])

  if (options && options.range) {
    var ticks = Math.max(2, Math.floor(Math.abs(options.range[1] - options.range[0]) / 75))
    this.scales[aesthetic]
      .range(options.range)
      .ticks(ticks)
  }
}

