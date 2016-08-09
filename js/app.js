/**
 * jiangyukun on 2016/07/27 10:00
 */
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, hashHistory, IndexRoute} from 'react-router'

import FullImagePreview from './components/common/FullImagePreview'
import NotificationContainer from './components/common/NotificationContainer'
import ChatApp from './components/ChatApp'
import ChatPanel from './components/ChatPanel'
import Signin from './components/Signin'

import '../css/app.scss'

const routerConfig = [
    {
        path: '/chat/index',
        component: ChatApp,
        childRoutes: [
            {
                path: 'index',
                component: ChatPanel
            }
        ]
    },
    {
        path: '/signin',
        component: Signin
    },
    {
        path: '/',
        component: Signin
    }
]

render(
    <Router routes={routerConfig} history={hashHistory}></Router>,
    document.getElementById('container')
)

render(
    <NotificationContainer/>, document.querySelector('.notification-container')
)

render(
    <FullImagePreview/>,
    document.getElementById('full-image-preview')
)
