/**
 * jiangyukun on 2016/07/27 10:00
 */
import 'babel-polyfill'
import 'whatwg-fetch'

import React from 'react'
import {render} from 'react-dom'
import {hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import Root from './container/root/Root'
import configureStore from './stores/configureStore'
import actionConstants from './actions/actionConstants'
import util from './core/utils/util'

import 'antd/lib/style/index.less'
import 'antd/lib/button/style/index.less'
import 'antd/lib/modal/style/index.less'
import 'antd/lib/notification/style/index.less'
import 'antd/lib/tooltip/style/index.less'
import '../../css/index.scss'

let username = util.getSession('username')
let initState = {
    curUserId: '',
    patients: [],
    rooms: [],
    doctors: [],
    members: [],
    singleMessage: [],
    roomMessage: [],
    historyMessage: [],
    chatList: []
}

let store = configureStore(initState)
let history = syncHistoryWithStore(hashHistory, store)
store.dispatch({type: actionConstants.app.INIT_SYSTEM, username})

render(
    <Root store={store} history={history}/>, document.getElementById('container')
)
