import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import extraData from '../middlewares/extra_data'
import sessionStorageState from '../middlewares/session-storage-state'
import rootReducer from '../reducers'

export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(thunk, extraData, sessionStorageState)
    )
}
