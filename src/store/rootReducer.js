import crudSlice from "./core/crudSlice";
import { combineReducers } from "redux";

const rootReducer = (asyncReducers) => (state, action) => {
	const combinedReducer = combineReducers({
		crudSlice,
		...asyncReducers,
	});
	return combinedReducer(state, action);
};

export default rootReducer;
