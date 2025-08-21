import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import vehicleReducer from '../slice/vehicles.slice';
import passengerReducer from '../slice/passengers.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  vehicle: vehicleReducer,
  passenger: passengerReducer,
  
});

export default rootReducer;
