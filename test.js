const { expect } = require("chai")
const {
  compactObj,
  renameKeys,
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
})
