import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from 'redux-thunk'
import incomeReducer from "./reducers/incomeReducer";

const rootReducer = combineReducers({ incomeReducer });

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;