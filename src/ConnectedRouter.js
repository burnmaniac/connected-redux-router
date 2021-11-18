import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Router as ReactRouter} from 'react-router';

import {locationChanged} from './connected-router.actions';
import {selectRouterState} from './connected-router.selectors';

const isHistorySame = (historyLocation, storeLocation) => {
    return historyLocation.pathname !== storeLocation.pathname
        || historyLocation.search !== storeLocation.search
        || historyLocation.hash !== storeLocation.hash
        || historyLocation.state !== storeLocation.state;
};

export class Router extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired,
        hasTimeTravel: PropTypes.bool,
        routerSelector: PropTypes.func,
    };

    static defaultProps = {
        hasTimeTravel: process.env.NODE_ENV === 'development',
        routerSelector: selectRouterState,
    };

    constructor(props) {
        super(props);

        this.state = {
            action: props.history.action,
            location: props.history.location,
        };

        if (this.props.hasTimeTravel === true) {
            // Subscribe to store changes to check if we are in time travelling
            this.removeStoreSubscription = props.store.subscribe(() => {
                // Extract store's location and browser location
                const storeLocation = props.routerSelector(props.store.getState()).location;
                const historyLocation = props.history.location;

                // If we do time travelling, the location in store is changed but location in history is not changed
                if (props.history.action === 'PUSH' && isHistorySame(historyLocation, storeLocation)) {
                    this.timeTravelling = true;

                    props.history.push(storeLocation);
                }
            });
        }

        // Dispatch initial location changed action (POP
        this.props.store.dispatch(locationChanged(props.history.location, props.history.action, true));
    }

    componentDidMount() {
        // Listen to history changes
        this.removeHistoryListener = this.props.history.listen(({location, action}) => {
            if (this.timeTravelling === false) {
                this.props.store.dispatch(locationChanged(location, action));
            } else {
                this.timeTravelling = false;
            }

            this.setState({action, location});
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.location.key !== nextState.location.key;
    }

    componentWillUnmount() {
        if (this.removeHistoryListener !== undefined) {
            this.removeHistoryListener();
        }

        if (this.removeStoreSubscription !== undefined) {
            this.removeStoreSubscription();
        }
    }

    render() {
        return (
            <ReactRouter
                navigationType={this.state.action}
                location={this.state.location}
                navigator={this.props.history}
            >
                {this.props.children}
            </ReactRouter>
        );
    }
}
