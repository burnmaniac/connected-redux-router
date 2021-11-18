import {LOCATION_CHANGED} from './connected-router.actions';

export const createRouterReducer = history => {
    const initialRouterState = {
        location: history.location,
        action: history.action,
    };

    /*
    * This reducer will update the state with the most recent location history has transitioned to.
    */
    return (state = initialRouterState, {type, payload}) => {
        if (type === LOCATION_CHANGED) {
            return {...state, ...payload};
        }

        return state;
    };
};
