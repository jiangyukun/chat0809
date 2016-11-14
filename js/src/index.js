/**
 * jiangyukun on 2016/07/27 10:00
 */
import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import {hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

import Root from './container/Root'
import configureStore from './stores/configureStore'
import NotificationContainer from './components/common/NotificationContainer'

import '../../css/index.scss'

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

render(
    <Root store={store} history={history}/>, document.getElementById('container')
)

render(
    <NotificationContainer/>, document.querySelector('.notification-container')
)
