import R from "ramda"

export const renameKeys = R.curry((keysMap, obj) =>
  R.reduce(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj)
  )
)

export const pickDeep = R.curry((paths, obj) => (
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

export const compactObj = R.pickBy(Boolean)
