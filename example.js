C('svg#points').q({
  x: 'm',
  y: 'n',
  fill: 'l',
  alpha: 0.25,
  geom: 'jitter',
  data: [
    {l: 'alpha', m: 20, n: 30},
    {l: 'alpha', m: 20, n: 30},
    {l: 'alpha', m: 20, n: 30},
    {l: 'alpha', m: 20, n: 30},
    {l: 'alpha', m: 20, n: 30},
    {l: 'alpha', m: 20, n: 30},
    {l: 'alpha', m: 20, n: 30},
    {l: 'alpha', m: 20, n: 30},
    {l: 'beta', m: 100, n: 80},
    {l: 'beta', m: 100, n: 80},
    {l: 'gamma', m: 100, n: 80},
    {l: 'beta', m: 100, n: 80},
    {l: 'beta', m: 100, n: 80},
    {l: 'beta', m: 100, n: 80},
    {l: 'gamma', m: 30, n: 80},
    {l: 'delta', m: 35, n: 10},
    {l: 'gamma', m: 30, n: 80},
    {l: 'delta', m: 35, n: 10},
    {l: 'gamma', m: 30, n: 80},
    {l: 'gamma', m: 35, n: 10},
    {l: 'gamma', m: 30, n: 80},
    {l: 'delta', m: 35, n: 10},
    {l: 'gamma', m: 30, n: 80},
    {l: 'alpha', m: 35, n: 10},
    {l: 'delta', m: 35, n: 10},
    {l: 'delta', m: 35, n: 10},
    {l: 'delta', m: 35, n: 10}
  ]
}).render()

C('svg#histogram', {'margin.left': 60 })
  .q(_(10000).times(d3.random.normal(50, 10)))
  .render()




