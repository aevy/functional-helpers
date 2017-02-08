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

/**
 * Same as R.evolve, except it runs all tranformations,
 * defaulting the value to undefined if the key doesn"t exist on object
 **/
export const evolveAll = R.curry(function _evolveAll(transformations, object) {
  const result = {}
  let transformation, key, type
  for (key in transformations) {
    transformation = transformations[key]
    type = typeof transformation
    result[key] = type === "function"
      ? transformation(object[key])
      : transformation && type === "object"
        ? _evolveAll(transformation, object[key])
        : object[key]
  }
  return R.merge(object, result)
})
