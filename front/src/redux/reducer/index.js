import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import vehicleReducer from '../slice/vehicles.slice';
import blogReducer from '../slice/blog.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  vehicle: vehicleReducer,
  blog: blogReducer,

});

export default rootReducer;
