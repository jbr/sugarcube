SC.geoms.tile = function() {
  SC.scales.categorical.call(this, 'x', { pad: 0, range: [0, this.width], rangePad: 0 })
  SC.scales.categorical.call(this, 'y', { pad: 0, range: [this.height, 0], rangePad: 0})
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
      .attr('height', chart.scales.y.rangeBand())
      .style('fill', function(d) { return chart.scales.fill(d.fill) })
      .attr('class', 'tile')
      .attr('transform', function(d) {
        return "translate(" + chart.scales.x(d.x) + ", "+(chart.scales.y(d.y))+")"
      })
  })
}

