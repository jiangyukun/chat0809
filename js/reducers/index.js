/**
 * Created by jiangyukun on 2016/11/1.
 */
import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux'

import * as login from './login'
import * as chat from './chat'
import * as patients from './list/patients'
import * as rooms from './list/rooms'
import * as doctor from './list/doctors'
import * as singleMessage from './singleMessage'
import * as roomMessage from './roomMessage'

export default combineReducers({
    ...login,
    ...patients,
    ...rooms,
    ...doctor,
    ...chat,
    ...singleMessage,
    ...roomMessage,
    routing
})
