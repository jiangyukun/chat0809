import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'


import extraData from '../middlewares/extra_data'
import sessionStorageState from '../middlewares/session-storage-state'

import rootReducer from '../reducers'
import DevTools from '../container/DevTools'

export default function configureStore(preloadedState) {
    const store = createStore(
        rootReducer,
        preloadedState,
        compose(
            applyMiddleware(thunk, extraData, sessionStorageState),
            DevTools.instrument()
        )
    )

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}
