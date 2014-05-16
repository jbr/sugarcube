SC.scales.continuous = function(aesthetic, options) {
  var extents = d3.extent(this.data.columns[aesthetic])

  if (options && options.pad)
    extents = SC.util.pad(options.pad, extents)

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

