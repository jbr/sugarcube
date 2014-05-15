SC('#path svg').q({
  data: [
    { a: 1, b: 10 },
    { a: 5, b: 4 },
    { a: 3, b: 5 }
  ],
  x: 'a',
  y: 'b',
  geom: 'path'
}).render()
