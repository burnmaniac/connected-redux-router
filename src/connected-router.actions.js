/**
 * This action type will be dispatched when your history
 * receives a location change.
 */
export const LOCATION_CHANGED = '@@connected-router/LOCATION_CHANGED';

/**
 * This action type will be dispatched by the history actions below.
 * If you're writing a middleware to watch for navigation events, be sure to
 * look for actions of this type.
 */
export const ROUTER_CALL_HISTORY_METHOD = '@@connected-router/CALL_HISTORY_METHOD';

/**
 * This action type will be dispatched when side effects start running.
 */
export const LOCATION_CHANGE_SIDE_EFFECTS = '@@connected-router/LOCATION_CHANGE_SIDE_EFFECTS';

/**
 * This action type will be dispatched when side effects should stop running.
 */
export const END_SIDE_EFFECTS_RUNNING = '@@connected-router/END_SIDE_EFFECTS_RUNNING';

export const locationChanged = (location, action, isFirstRender = false) => ({
    type: LOCATION_CHANGED,
    payload: {location, action, isFirstRender},
});

export const locationChangeSideEffects = payload => ({
    type: LOCATION_CHANGE_SIDE_EFFECTS,
    payload,
});

const updateLocation = method => {
    return (...args) => ({
        type: ROUTER_CALL_HISTORY_METHOD,
        payload: {method: method, args},
    });
};

/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */
export const push = updateLocation('push');
export const replace = updateLocation('replace');
export const go = updateLocation('go');
export const back = updateLocation('back');
export const forward = updateLocation('forward');

export const routerActions = {
    push,
    replace,
    go,
    back,
    forward,
};
