'use strict';

export { falsy };
import { PropTypes } from 'react';

var func = PropTypes.func;
var object = PropTypes.object;
var arrayOf = PropTypes.arrayOf;
var oneOfType = PropTypes.oneOfType;
var element = PropTypes.element;
var shape = PropTypes.shape;
var string = PropTypes.string;

function falsy(props, propName, componentName) {
  if (props[propName]) return new Error('<' + componentName + '> should not have a "' + propName + '" prop');
}

var history = shape({
  listen: func.isRequired,
  push: func.isRequired,
  replace: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired
});

export { history };
var component = oneOfType([func, string]);
export { component };
var components = oneOfType([component, object]);
export { components };
var route = oneOfType([object, element]);
export { route };
var routes = oneOfType([route, arrayOf(route)]);
export { routes };