SC.geoms.area = function() {
  this.data.columns.ymax = this.data.columns.y

  this.data.columns.ymin = this.data.columns.y
    .map(function(){return 0})

  this.data.rows = SC.util.columnsToRows(this.data.columns)

  SC.util.deepExtend(this, { 'limits.y.min': 0 })

  SC.scales.pick.call(this, 'y', { pad: 0, range: [this.height, 0]})
  this.options.ylab = this.aes.y

  SC.geoms.ribbon.call(this)
}
