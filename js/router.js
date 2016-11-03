/**
 * Created by jiangyukun on 2016/11/1.
 */

import ChatApp from './container/ChatApp'
import ChatPanel from './container/ChatPanel'
import Signin from './container/Signin'

let routers = [
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

export default routers
