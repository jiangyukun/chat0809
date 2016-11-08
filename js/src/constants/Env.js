/**
 * Created by jiangyukun on 2016/8/22.
 */

// const phase = 'dev'
const phase = 'release'

export default {
    isDev: function isDev() {
        return phase == 'dev'
    },
    isRelease: function isRelease() {
        return phase == 'release'
    }
}
