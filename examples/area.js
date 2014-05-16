SC('#area svg').q({
  data: [
    { pirates: 5, max: 10, countries: 10 },
    { pirates: 10, max: 15, countries: 15 },
    { pirates: 8, max: 16, countries: 20 },
    { pirates: 5, max: 7, countries: 25 }
  ],
  x: 'countries',
  y: 'pirates',
  geom: 'area'
}).render()
