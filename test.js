const R = require("ramda")
const { expect } = require("chai")
const {
  compactObj,
  renameKeys,
  evolveAll,
  pickDeep,
  pickTree,
  mergeBy,
} = require("./")

describe("functional helpers", () => {
  describe("renameKeys", () => {
    it("renames a key in an object", () => {
      const source = { foo: "bar" }
      expect(renameKeys({ foo: "hello"}, source))
        .to.have.property("hello")
        .and.not.have.property("foo")
    })

    it("doesn't change the value of the renamed key", () => {
      const source = { foo: "bar" }
      expect(renameKeys({ foo: "hello"}, source))
        .to.have.property("hello", source.foo)
    })

    it("doesn't touch other keys", () => {
      const source = {
        foo: "bar",
        oob: "lel",
      }
      expect(renameKeys({ foo: "hello"}, source))
        .to.have.property("oob", source.oob)
    })

  })

  describe("pickDeep", () => {
    const source = {
      foo: {
        bar: {
          x: 1,
          y: 2,
        }
      },
      oob: {
        far: {
          lol: "yeah",
        },
      },
    }

    it("picks a deep property and outputs an object with the same key and value as the property picked", () => {
      expect(pickDeep(["foo.bar"], source)).to.deep.equal({ bar: source.foo.bar })
    })

    it("takes multiple properties as input", () => {
      expect(pickDeep(["foo.bar.x", "oob.far"], source)).to.deep.equal({
        x: source.foo.bar.x,
        far: source.oob.far
      })
    })

  })

  describe("pickTree", () => {
    it("returns an empty object if input object doesn't have any keys", () => {
      expect(pickTree({}, {})).to.deep.equal({})
      expect(pickTree({}, { foo: 1 })).to.deep.equal({})
      expect(pickTree({}, { foo: { foo: 1, bar: "foo" } })).to.deep.equal({})
    })

    it("returns a shallow copy with all keys that exists on input, if they exist on source", () => {
      expect(pickTree({ foo: true }, {})).to.deep.equal({})
      expect(pickTree({ foo: true }, { foo: 1 })).to.deep.equal({ foo: 1 })
      expect(pickTree({ foo: true }, { foo: { foo: 1, bar: "foo" } }))
        .to.deep.equal({ foo: { foo: 1, bar: "foo" } })
      expect(pickTree({ bar: true }, { bar: "lel", foo: { foo: 1, bar: "foo" } }))
        .to.deep.equal({ bar: "lel" })
    })

    it("handles an array on the input tree as R.pick does", () => {
      expect(pickTree(
        {
          foo: ["foo", "bar"],
        },
        {
          foo: {
            foo: 1,
            bar: "foo",
            oob: null,
            far: 123,
          },
        }
      )).to.deep.equal(
        {
          foo: {
            foo: 1,
            bar: "foo",
          },
        }
      )
    })

    it("picks deeply nested values", () => {
      expect(pickTree(
        {
          foo: {
            bar: {
              oob: true,
            },
          },
        },
        {
          foo: {
            foo: 1,
            bar: {
              oob: "asdf",
              far: 123,
            },
            oob: null,
            far: 123,
          },
        }
      )).to.deep.equal(
        {
          foo: {
            bar: {
              oob: "asdf",
            },
          },
        }
      )
    })

    it("works exactly like R.pick if passed just an array", () => {
      expect(pickTree(["foo", "bar"], { foo: 1, bar: 2, oob: 3 })).to.deep.equal({ foo: 1, bar: 2 })
    })

    it("ignores keys on input with falsey values", () => {
      expect(pickTree({ foo: false, bar: true }, { foo: 1, bar: 2, oob: 3 })).to.deep.equal({ bar: 2 })
    })
  })

  describe("compactObj", () => {
    it("removes properties with falsy values from an object", () => {
      const falsyProps = {
        emptystring: "",
        undef: undefined,
        bool: false,
        zero: 0,
        nan: NaN,
        nul: null
      }
      expect(compactObj(falsyProps)).to.deep.equal({})
      expect(compactObj(falsyProps)).to.be.empty
    })

    it("does not remove properties with truthy values from an object", () => {
      const truthyProps = {
        nonzero: 1,
        string: "bar",
        object: {},
        symbol: Symbol(),
      }
      expect(compactObj(truthyProps)).to.deep.equal(truthyProps)
    })
  })

  describe("evolveAll", () => {
    it("works as R.evolve if all transformations exist on object", () => {
      const source = {
        firstName: "  Tomato ",
        id: 123,
      }
      const transformations = {
        firstName: R.trim,
        id: R.inc,
      }
      const result = {
        firstName: "Tomato",
        id: 124,
      }
      expect(evolveAll(transformations, source)).to.deep.equal(result)
    })

    it("runs transformation with `undefined` if it doesn't exist on object", () => {
      const source = {
        firstName: "  Tomato ",
        id: 123,
      }
      const transformations = {
        firstName: R.trim,
        lastName: R.identity,
        id: R.inc,
      }
      const result = {
        firstName: "Tomato",
        lastName: undefined,
        id: 124,
      }
      expect(evolveAll(transformations, source)).to.deep.equal(result)
    })

    it("carries over key/values if key doesn't exist on transformations", () => {
      const source = {
        firstName: "  Tomato ",
        id: 123,
      }
      const transformations = {
        firstName: R.trim,
        lastName: R.identity,
      }
      const result = {
        firstName: "Tomato",
        lastName: undefined,
        id: 123,
      }
      expect(evolveAll(transformations, source)).to.deep.equal(result)
    })

  })

  describe("mergeBy", () => {
    it("takes two functions, applies each one to obj, and merges the resulting object", () => {
      const obj = { foo: "bar", bar: { oob: "foo", far: "bar" } }
      expect(mergeBy(R.identity, R.identity, obj)).to.deep.equal(obj)
      expect(mergeBy(R.omit(["foo"]), R.omit(["bar"]), obj)).to.deep.equal(obj)
      expect(mergeBy(R.omit(["bar"]), R.prop(["bar"]), obj))
        .to.deep.equal({ foo: "bar", oob: "foo", far: "bar" })
      expect(mergeBy(R.omit(["bar"]), R.always({ lel: "wat" }), obj))
        .to.deep.equal({ foo: "bar", lel: "wat" })
    })

  })
})
