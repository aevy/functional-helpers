const R = require("ramda")
const { expect } = require("chai")
const {
  compactObj,
  renameKeys,
  evolveAll,
  pickDeep,
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

})
