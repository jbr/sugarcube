SC.registerAesthetics('x', 'y', 'fill', 'size', 'alpha')

SC.geoms.point = function() {
  var chart = this

  SC.scales.pick.call(this, 'x', { pad: 0.25, range: [0, this.width] })
  SC.scales.pick.call(this, 'y', { pad: 0.25, range: [this.height, 0]})
  SC.scales.pick.call(this, 'fill', { defaultValue: 'black', range: ['red', 'blue', 'green'] })
  SC.scales.pick.call(this, 'size', { defaultValue: 5, range: [5, 10] })
  SC.scales.pick.call(this, 'alpha', { defaultValue: 1, range: [0, 1] })

  SC.axis.x.call(this)
  SC.axis.y.call(this)

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
