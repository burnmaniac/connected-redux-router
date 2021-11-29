Connected Redux Router [![Build Status](https://app.travis-ci.com/burnmaniac/connected-redux-router.svg?branch=main)](https://app.travis-ci.com/burnmaniac/connected-redux-router)
===

Main features
---

* Synchronizes router state with Redux store with respect to uni-directional flow (i.e. history -> store -> router -> components)
* Supports React Router v6 and history v5
* Supports functional component hot reloading while preserving state
* Dispatching of history methods (`push`, `replace`, `go`, `back`, `forward`)
* Supports time travelling in Redux DevTools
* Supports running side effects on route change that are defined in route configuration

License
-------
[MIT License](https://github.com/burnmaniac/connected-redux-router/blob/main/LICENSE)
