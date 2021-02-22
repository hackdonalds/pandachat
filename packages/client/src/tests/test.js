// curl https://unpkg.com/chai@4.3.0/chai.js | esbuild --format=esm --target=es2016 --bundle > chai.js
import chai from "./lib/chai.js"

describe("A test", () => {
    it("does something", () => {
        chai.expect(2).to.equal(2)
    })
})