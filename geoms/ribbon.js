SC.registerAesthetics('ymin', 'ymax', 'x', 'stroke', 'alpha', 'fill')

SC.geoms.ribbon = function() {
  var chart = this

  SC.scales.pick.call(this, 'x', { pad: 0, range: [0, this.width] })

  this.data.columns.y = this.data.columns.ymin.concat(this.data.columns.ymax)

  SC.scales.pick.call(this, 'y', { pad: 0.25, range: [this.height, 0]})
  SC.scales.pick.call(this, 'stroke', { defaultValue: 'black', range: ['red', 'blue', 'green'] })
  SC.scales.pick.call(this, 'fill', { defaultValue: 'black', range: ['red', 'blue', 'green'] })
  SC.scales.pick.call(this, 'alpha', { defaultValue: 1, range: [0, 1] })

  this.options.ylab = this.options.ylab || this.aes.y || [this.aes.ymin, this.aes.ymax].join("...")

  SC.axis.x.call(this)
  SC.axis.y.call(this)


  this.renders.push(function() {
    this.element.append('path')
      .datum(this.data.rows)
      .style('stroke', function(d) { return chart.scales.stroke(d.stroke) })
      .style('opacity', function(d) { return chart.scales.alpha(d.alpha) })
      .style('fill', function(d) { return chart.scales.fill(d.fill) })
      .attr('class', 'ribbon')
      .attr('d', d3.svg.area()
            .x(function(d) { return chart.scales.x(d.x) })
            .y0(function(d) { return chart.scales.y(d.ymin) })
            .y1(function(d) { return chart.scales.y(d.ymax) }))
  })
}
