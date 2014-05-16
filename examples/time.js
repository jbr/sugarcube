SC('#time svg').q({
  data: {
    time: ['8:00am', '10:00am', '12:30pm', '3:00pm', '8:05pm'],
    movement: [5, 10, 15, 30, 3]
  },
  x: 'time',
  y: 'movement',
  geom: 'path'
}).render()
