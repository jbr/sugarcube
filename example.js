var histogramData = [
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
  {l: 'beta', m: 100, n: 80},
  {l: 'beta', m: 100, n: 80},
  {l: 'beta', m: 100, n: 80},
  {l: 'beta', m: 100, n: 80},
  {l: 'gamma', m: 30, n: 80},
  {l: 'delta', m: 35, n: 10},
  {l: 'gamma', m: 30, n: 80},
  {l: 'delta', m: 35, n: 10},
  {l: 'gamma', m: 30, n: 80},
  {l: 'delta', m: 35, n: 10},
  {l: 'gamma', m: 30, n: 80},
  {l: 'delta', m: 35, n: 10},
  {l: 'gamma', m: 30, n: 80},
  {l: 'delta', m: 35, n: 10},
  {l: 'delta', m: 35, n: 10},
  {l: 'delta', m: 35, n: 10},
  {l: 'delta', m: 35, n: 10}
]

window.histo = C({
  x: 'l',
  stat: 'bin',
  data: histogramData,
  geom: 'bar'
}).render('svg#histogram')




window.point = C({
  x: 'x',
  y: 'y',
  fill: 'color',
  size: 'size',
  geom: 'point',
  data: [
    {x: 10, y: 20, color: 10, size: 10},
    {x: 10, y: 30, color: 50, size: Math.random()* 100},
    {x: Math.random()*10, y: 30, color: 30, size: 15},
    {x: 30, y: Math.random()*20, color: 90, size: 5},
    {x: 10, y: 15, color: 10, size: 5}
  ]
}).render('svg#points')
