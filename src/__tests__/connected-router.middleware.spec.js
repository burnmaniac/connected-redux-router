import configureStore from 'redux-mock-store';
import {ROUTER_CALL_HISTORY_METHOD} from '../connected-router.actions';
import {createRouterMiddleware} from '../connected-router.middleware';

describe('createRouterMiddleware', () => {
    test('calls history method based on action payload values', () => {
        const history = {
            location: {},
            action: 'POP',
            push: jest.fn(),
            replace: jest.fn(),
            go: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
        };

        const middlewares = [createRouterMiddleware(history)];
        const mockStore = configureStore(middlewares);
        const store = mockStore({});

        // push
        store.dispatch({
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'push',
                args: ['/path/to/somewhere'],
            },
        });

        expect(history.push).toBeCalledWith('/path/to/somewhere');

        // replace
        store.dispatch({
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'replace',
                args: ['/path/to/somewhere'],
            },
        });

        expect(history.replace).toBeCalledWith('/path/to/somewhere');

        // go
        store.dispatch({
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'go',
                args: [5],
            },
        });

        expect(history.go).toBeCalledWith(5);

        // back
        store.dispatch({
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'back',
                args: [],
            },
        });

        expect(history.back).toBeCalled();

        // forward
        store.dispatch({
            type: ROUTER_CALL_HISTORY_METHOD,
            payload: {
                method: 'forward',
                args: [],
            },
        });

        expect(history.forward).toBeCalled();
    });

    test('passes to next middleware if action type is not CALL_HISTORY_METHOD', () => {
        const spy = jest.fn();

        const nextMiddleware = store => next => action => {
            // eslint-disable-line no-unused-vars
            spy(action);
        };

        const history = {};
        const middlewares = [createRouterMiddleware(history), nextMiddleware];
        const mockStore = configureStore(middlewares);
        const store = mockStore();

        const action = {
            type: 'NOT_HANDLE_ACTION',
            payload: {
                text: 'Hello',
            },
        };

        store.dispatch(action);

        expect(spy).toBeCalledWith(action);
    });
});
