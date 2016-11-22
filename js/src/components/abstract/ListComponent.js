/**
 * Created by jiangyukun on 2016/11/22.
 */
import React, {Component} from 'react'
import {merge} from 'lodash'

import {loadMore} from '../../constants/constants'

export default class ListComponent extends Component {

    getState() {
        return {maxCount: loadMore.init}
    }

    loadMore() {
        this.setState({maxCount: this.state.maxCount + loadMore.increase})
    }

    initRender() {
        this.currentCount = 0
        this.filterCount = 0
    }

    isContinueLoad() {
        this.filterCount++
        if (this.currentCount >= this.state.maxCount) {
            return false
        }
        this.currentCount++
        return true
    }

    haveMoreListItem() {
        return this.currentCount < this.filterCount
    }

}
