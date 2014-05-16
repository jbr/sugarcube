SC('#ribbon svg').q({
  data: [
    { min: 5, max: 10, duration: 10 },
    { min: 10, max: 15, duration: 15 },
    { min: 8, max: 16, duration: 20 },
    { min: 5, max: 7, duration: 25 }
  ],
  x: 'duration',
  ymin: 'min',
  ymax: 'max',
  geom: 'ribbon'
}).render()
