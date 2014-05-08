SC('#categorical svg')
  .q({
    y: 'count',
    x: 'word',
    fill: 'levity',
    geom: 'bar',
    'limits.y.min': 0,
    data: {
      word: ['hello', 'world', 'example', 'chart'],
      count: [5, 10, 2, 3],
      levity: [0, 0.2, 0.2, 1]
    }
  })
  .render()
      
      
