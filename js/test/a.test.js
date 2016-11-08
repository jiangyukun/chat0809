/**
 * Created by jiangyukun on 2016/11/8.
 */
const expect = require('chai').expect

function add(a, b) {
    return a + b
}

describe('hi', function () {
    it('试试看', function () {
        expect(add(1, 2)).to.be.equal(3)
    })
})
