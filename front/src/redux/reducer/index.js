import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';

export const rootReducer = combineReducers({
  auth: authReducer
});

export default rootReducer;
