/**
 * Created by jiangyukun on 2016/12/13.
 */
import moment from 'moment'

const weekMap = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
}

export function fromNow(dateStr) {
    const diff = moment(moment().format('YYYY-MM-DD')).diff(moment(dateStr, 'YYYY-MM-DD'))
    if (diff < 0) {
        return moment(dateStr).format('YYYY-MM-DD HH:mm')
    }
    if (diff >= 604800000) {
        return moment(dateStr).format('YYYY-MM-DD HH:mm')
    }

    const dayTime = moment(dateStr).format('HH:mm')
    if (diff == 0) {
        return dayTime
    }
    if (diff == 86400000) {
        return '昨天' + moment(dateStr).format('HH:mm')
    }
    const dayOfWeek = moment(dateStr).format('d')
    let week = '星期' + weekMap[dayOfWeek]

    return week + ' ' + moment(dateStr).format('HH:mm')
}
