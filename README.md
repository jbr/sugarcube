# Sugarcube
### Oh it's work all day for some sugar in your d3

D3 is great.  But I find myself copying and pasting boilerplate when I
use it. That means it doesn't provide the right level of abstraction
for the specific sort of tasks I've used it for. D3 is incredibly
powerful and customizable, but there are no defaults. This project is
an attempt to provide an entry-point to d3 that provides sensible
defaults and makes guesses about what you want to do. As the project
progresses, I hope to expose all of the underlying d3 objects.  The
goal is not at all to replace d3, but to make is so that we only have
to express differences from a theme or template in our code.

Some examples:

```javascript
// If my data is an array of numbers, I probably want a histogram
Sugarcube('svg').q([1,2,3,4,5]).render()

// If I pass in multidimensional data, I can specify aesthetic mappings:
Sugarcube('svg').q({
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


## Future

I'd like to be able to use this library like I use ggplot2 -- usually
I start with a qplot and then add `layer`s and `scale`s and `geom`s as
needed. D3 provides all of the expressive power, it's just not quite
as easy to get started and override / customize. Here are some
sketches of what _should_ be possible:

```javascript
SC('svg', {data: data})
  .statJitter()
  .geomPoint({ x: 'time', y: 'value' })
  .geomSmooth({ method: 'lm' })
  .render()
```

I'm not quite sure how to distinguish between "add" and "replace" but
ggplot2 doesn't make a distinction and I've never run into an issue
with that. There probably should be a `layer` primitive to allow
adding in situations that the library would assume replacement, but I
don't need ggplot2's `layer` very often.

I'd like sugarcube to be easily extensible, so libraries could provide
new and interesting geoms. Instead of just copying and pasting code
from http://bl.ocks.org, I'd like to be able to install a hexbin
library, for example, and be able to `geom: 'hexbin'` like you can in
ggplot2. Similarly, some of the `ggmap` features could be implemented
as plugins for sugarcube.

Sound interesting? Please help! I'm sharing this at an early stage to
solicit feedback. File bugs and issues, send pull requests, let me
know what you'd want from this sort of library.

Thanks!


