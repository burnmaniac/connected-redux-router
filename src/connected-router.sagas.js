import {matchRoutes} from 'react-router';
import {call, cancel, fork, take} from 'redux-saga/effects';
import {END_SIDE_EFFECTS_RUNNING, LOCATION_CHANGED, locationChangeSideEffects} from './connected-router.actions';

const prepareRouteState = function* (routes, location) {
    const matchedRouteBranch = matchRoutes(routes, location.pathname);

    if (!matchedRouteBranch) {
        return;
    }

    const branchSagas = getBranchSagas(matchedRouteBranch, location);

    yield* runBranchSagas(branchSagas);
};

const runBranchSagas = function* (branchSagas) {
    const subBranchSagas = [...branchSagas];

    let branchRouteSagas = subBranchSagas.pop() || [];

    if (branchRouteSagas.length) {
        branchRouteSagas = branchRouteSagas.reverse();
    }

    let shouldContinueRunning;

    while (branchRouteSagas.length > 0) {
        const [saga, ...args] = branchRouteSagas.pop();

        shouldContinueRunning = yield call(saga, ...args);

        if (shouldContinueRunning === END_SIDE_EFFECTS_RUNNING) {
            break;
        }
    }

    if (subBranchSagas.length > 0) {
        yield* runBranchSagas(subBranchSagas);
    }
};

const getBranchSagas = function (routeBranch, location) {
    const branchSagas = [];

    routeBranch
        .filter(branchItem => typeof branchItem.route.locationChangeSideEffects !== 'undefined'
            && Array.isArray(branchItem.route.locationChangeSideEffects))
        .forEach(branchItem => {
            const {route, params} = branchItem;
            const branchItemSideEffect = [];

            route.locationChangeSideEffects.forEach(sideEffect => {
                branchItemSideEffect.push([
                    sideEffect[0],
                    locationChangeSideEffects({
                        ...sideEffect[1],
                        params,
                        location,
                    }),
                ]);
            });

            branchSagas.push(branchItemSideEffect);
        });

    return branchSagas.reverse();
};

export const connectedRouteWatcher = function* (routes) {
    let loader;

    while (true) {
        const {payload} = yield take(LOCATION_CHANGED);

        if (loader) {
            yield cancel(loader);
        }

        loader = yield fork(prepareRouteState, routes, payload.location);
    }
};
