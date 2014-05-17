SC('#density svg').q({
  geom: 'density',
  data: _(1000).times(d3.random.normal(50, 10))
    .concat(_(500).times(d3.random.normal(100,20)))
}).render()
