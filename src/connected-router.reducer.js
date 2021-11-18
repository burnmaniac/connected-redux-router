import {LOCATION_CHANGED} from './connected-router.actions';

const injectQuery = (location) => {
    if (location && location.query) {
        // Don't inject query if it already exists in history
        return location;
    }

    const searchQuery = location && location.search;

    if (typeof searchQuery !== 'string' || searchQuery.length === 0) {
        return {
            ...location,
            query: {},
        };
    }

    // Ignore the `?` part of the search string e.g. ?username=codejockie
    const search = searchQuery.substring(1);

    // Split the query string on `&` e.g. ?username=codejockie&name=Kennedy
    const queries = search.split('&');

    // Construct query
    const query = queries.reduce((accumulator, currentQuery) => {
        // Split on `=`, to get key and value
        const [queryKey, queryValue] = currentQuery.split('=');

        return {
            ...accumulator,
            [queryKey]: queryValue,
        };
    }, {});

    return {
        ...location,
        query,
    };
};

export const createRouterReducer = history => {
    const initialRouterState = {
        location: injectQuery(history.location),
        action: history.action,
    };

    /*
    * This reducer will update the state with the most recent location history has transitioned to.
    */
    return (state = initialRouterState, {type, payload}) => {
        if (type === LOCATION_CHANGED) {
            const { location, action, isFirstRender } = payload

            return isFirstRender ? state : {...state, location: injectQuery(location), action}
        }

        return state;
    };
};
