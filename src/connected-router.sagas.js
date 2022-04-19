import {matchRoutes} from 'react-router';
import {call, cancel, fork, take, actionChannel} from 'redux-saga/effects';
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

        const {payload} = args[0];

        let effect = call;

        if (payload && payload.hasOwnProperty('isParallel') && payload.isParallel) {
            effect = fork;
        }

        shouldContinueRunning = yield effect(saga, ...args);

        if (shouldContinueRunning === END_SIDE_EFFECTS_RUNNING) {
            break;
        }
    }

    if (subBranchSagas.length > 0 && shouldContinueRunning !== END_SIDE_EFFECTS_RUNNING) {
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

    const requestChannel = yield actionChannel('LOCATION_CHANGED');

    while (true) {
        const {payload} = yield take(requestChannel);

        if (loader) {
            yield cancel(loader);
        }

        loader = yield fork(prepareRouteState, routes, payload.location);
    }
};
