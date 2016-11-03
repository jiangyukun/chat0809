/**
 * jiangyukun on 2016/07/27 10:00
 */
import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {Router, hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import thunk from 'redux-thunk'

import NotificationContainer from './components/common/NotificationContainer'
import routers from './router'
import rootReducers from './reducers'

import '../css/app.scss'

import Immutable from 'immutable'

let store = createStore(rootReducers, {
    curUserId: '',
    patients: [],
    rooms: [],
    doctorList: [],
    groupMembers: [],
    message: Immutable.fromJS({singles: [], groups: []})
}, applyMiddleware(thunk))
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
