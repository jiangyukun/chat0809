/**
 * Created by jiangyukun on 2016/12/13.
 */

const expect = require('chai').expect
import {fromNow} from '../../../src/core/utils/dateUtil'

describe('dateUtil', function () {
    it('fromNow', function () {
        let r = fromNow('2016-12-13T16:26:36+08:00')
        console.log(r)
    })
})
