import {combineReducers} from 'redux';
import {LOCATION_CHANGED} from '../connected-router.actions';
import {createRouterReducer} from '../connected-router.reducer';

describe('router reducer', () => {
    let mockHistory;

    beforeEach(() => {
        mockHistory = {
            location: {
                pathname: '/',
                search: '',
                hash: '',
            },
            action: 'POP',
        };
    });

    test('creates new root reducer with router reducer inside', () => {
        const mockReducer = (state = {}, action) => state;

        const rootReducer = combineReducers({
            mock: mockReducer,
            router: createRouterReducer(mockHistory),
        });

        const currentState = {
            mock: {},
            router: {
                location: {
                    pathname: '/',
                    search: '',
                    hash: '',
                },
                action: 'POP',
            },
        };

        const action = {
            type: LOCATION_CHANGED,
            payload: {
                location: {
                    pathname: '/path/to/somewhere',
                    search: '?query=test',
                    hash: '',
                },
                action: 'PUSH',
            },
        };

        const nextState = rootReducer(currentState, action);

        const expectedState = {
            mock: {},
            router: {
                location: {
                    pathname: '/path/to/somewhere',
                    search: '?query=test',
                    hash: '',
                    query: {query: 'test'},
                },
                action: 'PUSH',
            },
        };

        expect(nextState).toEqual(expectedState);
    });

    test('does not change state ref when action does not trigger any reducers', () => {
        const rootReducer = combineReducers({
            router: createRouterReducer(mockHistory),
        });

        const currentState = {
            router: {
                location: {
                    pathname: '/',
                    search: '',
                    hash: '',
                },
                action: 'POP',
            },
        };

        const action = {
            type: 'DUMMY_ACTION',
            payload: 'dummy payload',
        };

        const nextState = rootReducer(currentState, action);

        expect(nextState).toBe(currentState);
    });

    test('does not change state ref when receiving LOCATION_CHANGED for the first rendering', () => {
        const rootReducer = combineReducers({
            router: createRouterReducer(mockHistory),
        });

        const currentState = {
            router: {
                location: {
                    pathname: '/',
                    search: '',
                    hash: '',
                },
                action: 'POP',
            },
        };

        const action = {
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

        const nextState = rootReducer(currentState, action);

        expect(nextState).toBe(currentState);
    });

    test('does not replace query if it already exists in location', () => {
        const mockReducer = (state = {}, action) => state;

        const rootReducer = combineReducers({
            mock: mockReducer,
            router: createRouterReducer(mockHistory),
        });

        const currentState = {
            mock: {},
            router: {
                location: {
                    pathname: '/',
                    search: '',
                    hash: '',
                },
                action: 'POP',
            },
        };

        const action = {
            type: LOCATION_CHANGED,
            payload: {
                location: {
                    pathname: '/path/to/somewhere',
                    search: '?query=%7Bvalue%3A%20%27foobar%27%7D',
                    hash: '',
                    query: {query: {value: 'foobar'}},
                },
                action: 'PUSH',
            },
        };

        const nextState = rootReducer(currentState, action);

        const expectedState = {
            mock: {},
            router: action.payload,
        };

        expect(nextState).toEqual(expectedState);
    });
});
