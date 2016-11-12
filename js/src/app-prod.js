/**
 * jiangyukun on 2016/07/27 10:00
 */
import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'
import {Router, hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import thunk from 'redux-thunk'

import extraData from './middlewares/extra_data'
import sessionStorageState from './middlewares/session-storage-state'
import NotificationContainer from './components/common/NotificationContainer'
import routers from './router'
import rootReducers from './reducers'

import '../../css/index.scss'

let initState = {
    curUserId: '',
    patients: [],
    rooms: [],
    doctors: [],
    members: [],
    singleMessage: [],
    roomMessage: [],
    historyMessage: []
}

let store = createStore(rootReducers, initState, compose(
    applyMiddleware(thunk, extraData, sessionStorageState)
))

let history = syncHistoryWithStore(hashHistory, store)

render(
    <Provider store={store}>
        <Router routes={routers} history={history}></Router>
    </Provider>,
    document.getElementById('container')
)

render(
    <NotificationContainer/>, document.querySelector('.notification-container')
)