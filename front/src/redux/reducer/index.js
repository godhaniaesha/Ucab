import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import vehicleReducer from '../slice/vehicles.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  vehicle: vehicleReducer,
});

export default rootReducer;
