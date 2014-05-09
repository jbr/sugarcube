// compare to
// http://bl.ocks.org/mbostock/3885304

var data = {
  letter: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(""),
  frequency: [
    0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02288,
    0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025,
    0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987,
    0.06327, 0.09056, 0.02758, 0.00978, 0.0236, 0.0015,
    0.01974, 0.00074
  ]
}


SC('#alphabet svg').q({
  data: data,
  x: 'letter',
  y: 'frequency',
  geom: 'bar'
}).render()
