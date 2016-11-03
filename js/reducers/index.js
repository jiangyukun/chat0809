/**
 * Created by jiangyukun on 2016/11/1.
 */
import {combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux'

import * as login from './login'
import * as appReducers from './chat'
import * as messageReducers from './message'

export default combineReducers({
    ...appReducers,
    ...login,
    ...messageReducers,
    routing
})
