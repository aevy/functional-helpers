const R = require("ramda")

const renameKeys = R.curry((keysMap, obj) =>
  R.reduce(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj)
  )
)

const pickDeep = R.curry((paths, obj) => (
  R.pipe(
    R.map(
      R.pipe(
        R.split("."),
        pathArr => ({ [R.last(pathArr)]: R.path(pathArr, obj) })
      )
    ),
    R.mergeAll
  )(paths)
))

const compactObj = R.pickBy(Boolean)

module.exports = {
  compactObj,
  renameKeys,
  pickDeep,
}
