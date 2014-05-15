SC.geoms.path = function() {
  var chart = this

  SC.scales.pick.call(this, 'x', { pad: 0.25, range: [0, this.width] })
  SC.scales.pick.call(this, 'y', { pad: 0.25, range: [this.height, 0]})
  SC.scales.pick.call(this, 'stroke', { defaultValue: 'black', range: ['red', 'blue', 'green'] })
  SC.scales.pick.call(this, 'size', { defaultValue: 5, range: [5, 10] })
  SC.scales.pick.call(this, 'alpha', { defaultValue: 1, range: [0, 1] })

  SC.axis.x.call(this)
  SC.axis.y.call(this)

  this.renders.push(function() {
    this.element.append('path')
      .datum(this.data.rows)
      .style('stroke', function(d) { return chart.scales.stroke(d.stroke) })
      .style('opacity', function(d) { return chart.scales.alpha(d.alpha) })
      .style('fill', 'none')
      .attr('class', 'line')
      .attr('d', d3.svg.line()
            .x(function(d) { return chart.scales.x(d.x); })
            .y(function(d) { return chart.scales.y(d.y); }))
  })
}
