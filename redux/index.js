import { createStore, combineReducers,applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import MainScreen from './reducers/MainScreen'
import HomeStack from './reducers/HomeStack'

const rootReducer = combineReducers({
    MainScreen,
    HomeStack
});
  
export default createStore(rootReducer,applyMiddleware(thunk));