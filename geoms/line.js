SC.geoms.line = function() {
  this.data.rows = _(this.data.rows).sortBy('x')
  this.data.columns = SC.util.rowsToColumns(this.data.rows)
  SC.geoms.path.call(this)
}
