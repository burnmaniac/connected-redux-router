import {
    back,
    ROUTER_CALL_HISTORY_METHOD,
    forward,
    go,
    LOCATION_CHANGED,
    locationChanged,
    push,
    replace,
} from '../connected-router.actions';

describe('action creators', () => {
    test('onLocationChanged', () => {
        const actualAction = locationChanged({pathname: '/', search: '', hash: ''}, 'POP');

        const expectedAction = {
            type: LOCATION_CHANGED,
            payload: {
                location: {
                    pathname: '/',
                    search: '',
                    hash: '',
                },
                action: 'POP',
                isFirstRender: false,
            },
        };

        expect(actualAction).toEqual(expectedAction);
    });

    test('onLocationChanged for the first rendering', () => {
        const actualAction = locationChanged({pathname: '/', search: '', hash: ''}, 'POP', true);

        const expectedAction = {
            type: LOCATION_CHANGED,
            payload: {
                location: {
                    pathname: '/',
                    search: '',
                    hash: '',
                },
                action: 'POP',
                isFirstRender: true,
            },
        };

        expect(actualAction).toEqual(expectedAction);
    });

    test('push()', () => {
        const actualAction = push('/path/to/somewhere');

        const expectedAction = {
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'push',
                args: ['/path/to/somewhere'],
            },
        };

        expect(actualAction).toEqual(expectedAction);
    });

    test('replace()', () => {
        const actualAction = replace('/path/to/somewhere');

        const expectedAction = {
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'replace',
                args: ['/path/to/somewhere'],
            },
        };

        expect(actualAction).toEqual(expectedAction);
    });

    test('go()', () => {
        const actualAction = go(2);

        const expectedAction = {
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'go',
                args: [2],
            },
        };

        expect(actualAction).toEqual(expectedAction);
    });

    test('back()', () => {
        const actualAction = back();

        const expectedAction = {
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'back',
                args: [],
            },
        };

        expect(actualAction).toEqual(expectedAction);
    });

    test('forward()', () => {
        const actualAction = forward();

        const expectedAction = {
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'forward',
                args: [],
            },
        };

        expect(actualAction).toEqual(expectedAction);
    });
});
