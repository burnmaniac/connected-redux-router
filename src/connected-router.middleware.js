import {ROUTER_CALL_HISTORY_METHOD} from './connected-router.actions';

export const createRouterMiddleware = history => {
    return () => next => action => {
        if (action.type !== ROUTER_CALL_HISTORY_METHOD) {
            return next(action);
        }

        const {payload: {method, args}} = action;

        history[method](...args);
    };
};
