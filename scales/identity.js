SC.scales.identity = function(aesthetic, value) {
  if (_(value).isObject()) value = value.defaultValue
  this.scales[aesthetic] = function() { return value }
}
