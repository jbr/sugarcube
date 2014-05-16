SC.scales.categorical = function(aesthetic, options) {
  this.limits[aesthetic] = _(this.data.columns[aesthetic]).unique()
  this.scales[aesthetic] = d3.scale.ordinal().domain(this.limits[aesthetic])

  if ((aesthetic === 'x' || aesthetic === 'y')) {
    _(options).defaults({ rangePad: 0.1 })
    this.scales[aesthetic].rangeRoundBands(options.range, options.rangePad, options.rangePad)
  } else {
    this.scales[aesthetic].range(options.range)
  }
}
