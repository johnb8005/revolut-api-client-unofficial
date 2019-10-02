"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _requestPromise = _interopRequireDefault(require("request-promise"));

// this code is forked from https://github.com/tducret/revolut-python
// api host
var host = 'https://api.revolut.com'; // default token used when token has not been received yet

var tokenDefault = 'QXBwOlM5V1VuU0ZCeTY3Z1dhbjc'; // create header based on the token

var getHeaders = function getHeaders(token) {
  var device_id = 'revolut_cli';
  return {
    'Host': 'api.revolut.com',
    'X-Api-Version': '1',
    'X-Device-Id': device_id,
    'X-Client-Version': '6.6.2',
    'User-Agent': 'Revolut/5.5 500500250 (CLI; Android 4.4.2)',
    'Authorization': 'Basic ' + token
  };
};
/**
 * wrapper around Rp to make requests easier
 */


var makeRequest =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(uri, token) {
    var body,
        method,
        json,
        url,
        headers,
        options,
        r,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            body = _args.length > 2 && _args[2] !== undefined ? _args[2] : undefined;
            method = body ? 'POST' : 'GET';
            json = true;
            url = host + uri;
            headers = getHeaders(token);
            options = {
              url: url,
              headers: headers,
              method: method,
              json: json,
              body: body
            };
            _context.prev = 6;
            _context.next = 9;
            return (0, _requestPromise["default"])(options);

          case 9:
            r = _context.sent;
            return _context.abrupt("return", r);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](6);
            console.log('err');
            console.log(_context.t0.response.body);
            return _context.abrupt("return", null);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[6, 13]]);
  }));

  return function makeRequest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * first step of the login
 * @param  body: {phone, password}
 * @return {phone} (not important)
 * note the request is done with the default token here
 */


var login =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(phone, password) {
    var body, r;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            body = {
              phone: phone,
              password: password
            };
            _context2.next = 3;
            return makeRequest('/signin', tokenDefault, body);

          case 3:
            r = _context2.sent;

            if (!(r === null)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", null);

          case 6:
            return _context2.abrupt("return", {
              phone: phone
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function login(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * second step of the login
 * @param phone 
 * @param inputcode: SMS code received
 * @return { token }
 */


var loginSms =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(phone, inputcode) {
    var code, body, r, accessToken, user, userId, preToken, token;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // very quick cleaning of the input code
            code = inputcode.replace('-', '');
            body = {
              phone: phone,
              code: code
            };
            _context3.prev = 2;
            _context3.next = 5;
            return makeRequest('/signin/confirm', tokenDefault, body);

          case 5:
            r = _context3.sent;
            // extract params of interest from the response
            accessToken = r.accessToken, user = r.user; // get the user id

            userId = user.id; // create the non base 64 token

            preToken = userId + ':' + accessToken; // turn into base 64

            token = Buffer.from(preToken).toString('base64');
            return _context3.abrupt("return", {
              phone: phone,
              token: token
            });

          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](2);
            console.error('something went wrong while retrieving token');
            return _context3.abrupt("return", false);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[2, 13]]);
  }));

  return function loginSms(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * retrieves the list of account
 * @param token 
 * @return array with the list of accounts
 */


var getAccounts =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(token) {
    var url;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            url = host + '/user/current/wallet';
            return _context4.abrupt("return", makeRequest('/user/current/wallet', token));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getAccounts(_x7) {
    return _ref4.apply(this, arguments);
  };
}(); // did not test


var exchange =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(fromCcy, fromAmount, toCcy, token) {
    var toAmount, body;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            toAmount = null;
            body = {
              fromCcy: fromCcy,
              fromAmount: fromAmount,
              toCcy: toCcy,
              toAmount: toAmount
            };
            _context5.next = 4;
            return makeRequest('/exchange', token, body);

          case 4:
            return _context5.abrupt("return", _context5.sent);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function exchange(_x8, _x9, _x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * execute payment to a phone
 * @param phone: recipient phone number
 * @param amount: amount to be transferred (x 100: 2.34USD => 234)
 * @param currency: three letter code of the currency
 */


var payment =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(phone, amount, currency, token) {
    var recipient, body;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (typeof currency === 'undefined') {
              currency = 'USD';
            }

            recipient = "{\"phone\": \"".concat(phone, "\"}");
            body = {
              amount: amount,
              currency: currency,
              recipient: recipient
            };
            _context6.next = 5;
            return makeRequest('/transfer', token, body);

          case 5:
            return _context6.abrupt("return", _context6.sent);

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function payment(_x12, _x13, _x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}();

var _default = {
  getAccounts: getAccounts,
  exchange: exchange,
  payment: payment,
  loginSms: loginSms,
  login: login
};
exports["default"] = _default;