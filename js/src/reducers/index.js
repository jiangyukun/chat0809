/**
 * Created by jiangyukun on 2016/11/1.
 */
import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux'

import * as login from './login'
import * as app from './app'
import chatList from './chatList'
import * as patients from './list/patients'
import * as rooms from './list/rooms'
import * as doctor from './list/doctors'
import * as members from './list/members'
import * as singleMessage from './singleMessage'
import * as roomMessage from './roomMessage'
import * as historyMessage from './historyMessage'

export default combineReducers({
    ...login,
    ...patients,
    ...rooms,
    ...doctor,
    ...members,
    ...app,
    ...singleMessage,
    ...roomMessage,
    ...historyMessage,
    chatList,
    routing
})
