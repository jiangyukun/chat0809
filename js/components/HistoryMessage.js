/*
 * jiangyukun on 2016-07-29 19:25
 */
import React, {Component} from 'react'

import Audio from './common/Audio'
import {MessageType} from '../constants/ChatConstants'
import util from './core/util'
import classnames from 'classnames'
import ImagePreviewActions from '../actions/ImagePreviewActions'

export default class Message extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let historyMessageList = this.props.historyMessage

        return (
            <div className="col-xs-12">

            </div>
        )
    }
}
