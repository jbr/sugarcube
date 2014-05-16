SC('#points svg').q({
  x: 'height',
  y: 'weight',
  geom: 'point',
  data: {
    height: [ 1, 2, 3, 4, 5 ],
    weight: [ 100, 23, 500, 100, 250 ]
  }
}).render()
