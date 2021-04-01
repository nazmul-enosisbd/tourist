import {createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import touristPlaceReducer from './touristPlace/touristPlaceReducer'

const store = createStore(touristPlaceReducer, composeWithDevTools(applyMiddleware(logger)))

export default store 