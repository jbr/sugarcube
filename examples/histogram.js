SC('#histogram svg', {'margin.left': 60 })
  .q(_(10000).times(d3.random.normal(50, 10)))
  .render()
