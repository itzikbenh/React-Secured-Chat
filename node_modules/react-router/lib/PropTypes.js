'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _deprecateObjectProperties = require('./deprecateObjectProperties');

var _deprecateObjectProperties2 = _interopRequireDefault(_deprecateObjectProperties);

var _InternalPropTypes = require('./InternalPropTypes');

var InternalPropTypes = _interopRequireWildcard(_InternalPropTypes);

var _routerWarning = require('./routerWarning');

var _routerWarning2 = _interopRequireDefault(_routerWarning);

var func = _react.PropTypes.func;
var object = _react.PropTypes.object;
var shape = _react.PropTypes.shape;
var string = _react.PropTypes.string;
var routerShape = shape({
  push: func.isRequired,
  replace: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired,
  setRouteLeaveHook: func.isRequired,
  isActive: func.isRequired
});

exports.routerShape = routerShape;
var locationShape = shape({
  pathname: string.isRequired,
  search: string.isRequired,
  state: object,
  action: string.isRequired,
  key: string
});

exports.locationShape = locationShape;
// Deprecated stuff below:

var falsy = InternalPropTypes.falsy;
exports.falsy = falsy;
var history = InternalPropTypes.history;
exports.history = history;
var location = locationShape;
exports.location = location;
var component = InternalPropTypes.component;
exports.component = component;
var components = InternalPropTypes.components;
exports.components = components;
var route = InternalPropTypes.route;
exports.route = route;
var routes = InternalPropTypes.routes;
exports.routes = routes;
var router = routerShape;

exports.router = router;
if (process.env.NODE_ENV !== 'production') {
  (function () {
    var deprecatePropType = function deprecatePropType(propType, message) {
      return function () {
        process.env.NODE_ENV !== 'production' ? _routerWarning2['default'](false, message) : undefined;
        return propType.apply(undefined, arguments);
      };
    };

    var deprecateInternalPropType = function deprecateInternalPropType(propType) {
      return deprecatePropType(propType, 'This prop type is not intended for external use, and was previously exported by mistake. These internal prop types are deprecated for external use, and will be removed in a later version.');
    };

    var deprecateRenamedPropType = function deprecateRenamedPropType(propType, name) {
      return deprecatePropType(propType, 'The `' + name + '` prop type is now exported as `' + name + 'Shape` to avoid name conflicts. This export is deprecated and will be removed in a later version.');
    };

    exports.falsy = falsy = deprecateInternalPropType(falsy);
    exports.history = history = deprecateInternalPropType(history);
    exports.component = component = deprecateInternalPropType(component);
    exports.components = components = deprecateInternalPropType(components);
    exports.route = route = deprecateInternalPropType(route);
    exports.routes = routes = deprecateInternalPropType(routes);

    exports.location = location = deprecateRenamedPropType(location, 'location');
    exports.router = router = deprecateRenamedPropType(router, 'router');
  })();
}

var defaultExport = {
  falsy: falsy,
  history: history,
  location: location,
  component: component,
  components: components,
  route: route,
  // For some reason, routes was never here.
  router: router
};

if (process.env.NODE_ENV !== 'production') {
  defaultExport = _deprecateObjectProperties2['default'](defaultExport, 'The default export from `react-router/lib/PropTypes` is deprecated. Please use the named exports instead.');
}

exports['default'] = defaultExport;