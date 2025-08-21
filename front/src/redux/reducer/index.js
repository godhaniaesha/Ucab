import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/auth.slice';
import vehicleReducer from '../slice/vehicles.slice';
import blogReducer from '../slice/blog.slice';
import passengerReducer from '../slice/passengers.slice';
import contactReducer from '../slice/contact.slice'; // Import the contactReducer
import transactionReducer from '../slice/transaction.slice';
import adminReducer from '../slice/admin.slice'

export const rootReducer = combineReducers({
  auth: authReducer,
  vehicle: vehicleReducer,
  blog: blogReducer,
  passenger: passengerReducer,  
  contact:contactReducer,
  transactions: transactionReducer,
  admin:adminReducer
});

export default rootReducer;
