SC('#histogram svg')
  .q(_(10000).times(d3.random.normal(50, 10)))
  .render()
