SC.geoms.bar = function() {
  SC.util.deepSet(this, 'limits.y.min', 0)
  SC.scales.pick.call(this, 'x', { range: [0, this.width] })
  SC.scales.pick.call(this, 'y', { pad: 0.25, range: [this.height, 0]})
  SC.scales.pick.call(this, 'fill', { defaultValue: 'black', range: ['red', 'blue'] })

  SC.axis.x.call(this)
  SC.axis.y.call(this)

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

