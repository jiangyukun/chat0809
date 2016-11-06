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

import DevTools from './DevTools'
import NotificationContainer from './components/common/NotificationContainer'
import routers from './router'
import rootReducers from './reducers'
import sessionStorageState from './middlewares/session-storage-state'

import '../css/app.scss'

let initState = {
    curUserId: '',
    patients: [],
    rooms: [],
    doctorList: [],
    groupMembers: [],
    singleMessage: [],
    roomMessage: []
}

let store = createStore(rootReducers, initState, compose(
    applyMiddleware(thunk, sessionStorageState),
    DevTools.instrument()
))

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers/', () => {
        const nextRootReducer = require('./reducers/').default
        store.replaceReducer(nextRootReducer)
    })
}

let history = syncHistoryWithStore(hashHistory, store)

render(
    <Provider store={store}>
        <div>
            <Router routes={routers} history={history}></Router>
            <DevTools/>
        </div>
    </Provider>,
    document.getElementById('container')
)

render(
    <NotificationContainer/>, document.querySelector('.notification-container')
)
