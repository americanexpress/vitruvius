'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = vitruvius;

var _combineReducers = require('redux/lib/combineReducers');

var _combineReducers2 = _interopRequireDefault(_combineReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function vitruvius(reducers) {
  var combined = (0, _combineReducers2.default)(reducers);

  combined.buildInitialState = function buildInitialState(locals) {
    var builtState = {};

    Object.keys(reducers).forEach(function (key) {
      var reducer = reducers[key];
      if (typeof reducer === 'function' && typeof reducer.buildInitialState === 'function') {
        builtState[key] = reducer.buildInitialState(locals);
      }
    });

    return builtState;
  };

  return combined;
}