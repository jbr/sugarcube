### D3 is awesome

But I find myself copying and pasting boilerplate when I use it. That
means it doesn't provide the right level of abstraction for the
specific sort of tasks I've used it for. D3 is incredibly powerful and
customizable, but there are no defaults. This project is an attempt to
provide an entry-point to d3 that provides sensible defaults and makes
guesses about what you want to do. As the project progresses, I hope
to expose all of the underlying d3 objects.  The goal is not at all to
replace d3, but to make is so that we only have to express differences
from a theme or template in our code.

Some examples:

```javascript
// If my data is an array of numbers, I probably want a histogram
Chart('svg').q([1,2,3,4,5]).render()

// If I pass in two dimensional data, I can specify aesthetic mappings:
Chart('svg').q({
  x: 'time',
  y: 'altitude',
  color: 'temperature',
  alpha: 0.5,
  geom: 'point',
  data: {time: [...], altitude: [...], temperature: [...]}
}).render()

// note that this would also work:
data: [
  {time: 1, altitude: 1, temperature: 1},
  {time: 2, altitude: 2, temperature: 2},
  ...
]
// the library figures out the structure of the data

```



