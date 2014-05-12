SC.stats.jitter = function() {
  var chart = this
  _(['x', 'y']).each(function(column) {
    var extent = d3.extent(chart.data.columns[column])
    ,   range = Math.abs(extent[1] - extent[0])
    ,   jitter = range * 0.05
    ,   random = d3.random.normal(0, jitter)

    chart.data.columns[column] = chart.data.columns[column].map(function(p) {
      return p + random()
    })

    chart.data.rows = SC.util.columnsToRows(chart.data.columns)
  })
}

