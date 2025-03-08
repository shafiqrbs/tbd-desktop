import crudSlice from "./core/crudSlice";
import utilitySlice from "./core/utilitySlice";
import { combineReducers } from "redux";

const rootReducer = (asyncReducers) => (state, action) => {
	const combinedReducer = combineReducers({
		crudSlice,
		utilitySlice,
		...asyncReducers,
	});
	return combinedReducer(state, action);
};

export default rootReducer;
