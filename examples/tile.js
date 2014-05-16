SC('#tile svg').q({
  x: 'x',
  y: 'y',
  fill: 'z',
  geom: 'tile',
  data: _(26).chain().times(function(i) {
    return _(26).times(function(j) {
      return {
        x: String.fromCharCode(i + 65),
        y: String.fromCharCode(j + 97),
        z: Math.sqrt(i * j)
      }
    })
  }).flatten().value()
}).render()
