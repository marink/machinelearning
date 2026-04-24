import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk';

const initialState = {
    lastUpdate: 0,
    light: false,
    count: 0
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'TICK':
            return {
                ...state,
                lastUpdate: action.lastUpdate,
                light: !!action.light
            }
        case 'INCREMENT':
            return {
                ...state,
                count: state.count + 1
            }
        case 'DECREMENT':
            return {
                ...state,
                count: state.count - 1
            }
        case 'RESET':
            return {
                ...state,
                count: initialState.count
            }
        default:
            return state
    }
}

export function initializeStore(preloadedState = initialState) {
    return createStore(
        reducer,
        preloadedState,
        composeWithDevTools(applyMiddleware(thunk))
    )
}
