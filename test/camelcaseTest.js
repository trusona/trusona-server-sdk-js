const chai = require('chai')
const assert = chai.assert

const camelcase = require('../src/http/client/camelcase')

describe('camelcase', () => {
  it('should camelcase an object', () => {
    const test = { some_key: "some_value" }
    const expected = { someKey: "some_value" }
    assert.deepEqual(camelcase(test), expected)
  })

  it('should camelcase nested objects', () => {
    const test = { outer_object: { inner_object: { inner_key: "some_value" }}}
    const expected = { outerObject: { innerObject: { innerKey: "some_value" }}}
    assert.deepEqual(camelcase(test), expected)
  })

  it('should camelcase arrays', () => {
    const test = [{ some_key: "some_value"}]
    const expected = [{ someKey: "some_value"}]
    assert.deepEqual(camelcase(test), expected)
  })

  it('should camelcase nested arrays', () => {
    const test = { outer_object: [{ inner_object: { inner_key: "some_value" }}]}
    const expected = { outerObject: [{ innerObject: { innerKey: "some_value" }}]}
    assert.deepEqual(camelcase(test), expected)
  })
})