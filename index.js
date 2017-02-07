var R = require("ramda")

var renameKeys = R.curry(function (keysMap, obj) {
  return R.reduce(
    function (acc, key) {
      return R.assoc(keysMap[key] || key, obj[key], acc)
    },
    {},
    R.keys(obj)
  )
})

var pickDeep = R.curry(function (paths, obj) {
  return R.pipe(
    R.map(
      R.pipe(
        R.split("."),
        function (pathArr) {
          return { [R.last(pathArr)]: R.path(pathArr, obj) }
        }
      )
    ),
    R.mergeAll
  )(paths)
})

var compactObj = R.pickBy(Boolean)

module.exports = {
  compactObj,
  renameKeys,
  pickDeep,
}
