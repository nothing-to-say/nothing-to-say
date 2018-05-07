/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Replacer = __webpack_require__(5).Replacer;
var WeightedChoice = __webpack_require__(1).WeightedChoice;
var noOp = __webpack_require__(4);

function normalizeWeights(weightedChoices) {
  var normalized = [];
  var sum = 0;
  var nullWeightCount = 0;
  for (var w = 0; w < weightedChoices.length; w++) {
    var weightedChoice = weightedChoices[w];
    normalized.push(weightedChoice.clone());
    if (weightedChoice.weight === null) {
      nullWeightCount++;
    } else {
      sum += weightedChoice.weight;
    }
  }
  var nullWeight = (100 - sum) / nullWeightCount;
  for (var n = 0; n < normalized.length; n++) {
    if (normalized[n].weight === null) {
      normalized[n].weight = nullWeight;
    }
  }
  return normalized;
}

function randomFloat(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Randomly choose from an array of weighted choices.
 *
 * The probability of any given `WeightedChoice` being
 * chosen is its weight divided by the sum of all given
 * choices.
 */
function weightedChoose(weights) {
  var sum = 0;
  for (var i = 0; i < weights.length; i++) {
    sum += weights[i].weight;
  }
  var progress = 0;
  var pickedValue = randomFloat(0, sum);
  for (var w = 0; w < weights.length; w++) {
    progress += weights[w].weight;
    if (progress >= pickedValue) {
      return weights[w].choice;
    }
  }
  // If we're still here, something went wrong.
  // Log a warning but try to return a random value anyways.
  console.log('Unable to pick weighted choice for weights: ' + weights);
  return weights[randomInt(0, weights.length)].choice;
}

/**
 * Create a Replacer which selects from an array of `WeightedChoice`s
 *
 * The sum of the probabilities in `choices` should be less than 100.
 * All `WeightedChoice`s with a weight of `null` share an equal probability
 * within whatever probability remains in the input choices.
 *
 * If includeNoOp is `true`, a noOp option will be inserted with weight `null`,
 * to be normalized as described above.
 */
function createWeightedOptionReplacer(choices, includeNoOp) {
  var normalizedWeights = undefined;
  if (includeNoOp === true) {
    var choicesWithNoOp = choices.slice();
    choicesWithNoOp.push(new WeightedChoice(noOp, null));
    normalizedWeights = normalizeWeights(choicesWithNoOp);
  } else {
    normalizedWeights = normalizeWeights(choices);
  }
  function replacerFunction(match, fullText, matchIndex) {
    return weightedChoose(normalizedWeights);
  };
  return new Replacer(replacerFunction);
}

exports.normalizeWeights = normalizeWeights;
exports.weightedChoose = weightedChoose;
exports.createWeightedOptionReplacer = createWeightedOptionReplacer;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * An outcome with a weight.
 */

var WeightedChoice = (function () {
  function WeightedChoice(choice, weight) {
    _classCallCheck(this, WeightedChoice);

    this.choice = choice;
    this.weight = weight;
  }

  _createClass(WeightedChoice, [{
    key: "toString",
    value: function toString() {
      return "WeightedChoice{choice: " + this.choice + ", weight: " + this.weight + "}";
    }

    /* Create a new WeightedChoice object with the same properties as this one. */
  }, {
    key: "clone",
    value: function clone() {
      return new WeightedChoice(this.choice, this.weight);
    }
  }]);

  return WeightedChoice;
})();

exports.WeightedChoice = WeightedChoice;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var stringUtils = __webpack_require__(7);

function JavascriptSyntaxError(string, charIndex) {
  this.name = 'JavascriptSyntaxError';
  this.message = 'Syntax error found while parsing bml javascript at ' + stringUtils.lineColumnString(string, charIndex);
  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
}
JavascriptSyntaxError.prototype = Object.create(Error.prototype);

function BMLSyntaxError(message, string, charIndex) {
  this.name = 'BMLSyntaxError';
  if (message) {
    this.message = message;
    if (charIndex) {
      this.message += ' at ' + stringUtils.lineColumnString(string, charIndex);
    }
  } else {
    this.message = 'Syntax error found while parsing bml';
    if (charIndex) {
      this.message += ' at ' + stringUtils.lineColumnString(string, charIndex);
    }
  }
  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
}
BMLSyntaxError.prototype = Object.create(Error.prototype);

function BMLNameError(name, string, charIndex) {
  this.name = 'BMLNameError';
  this.message = 'Unknown name: "' + name + '" at ' + stringUtils.lineColumnString(string, charIndex);
  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
}
JavascriptSyntaxError.prototype = Object.create(Error.prototype);

function UnknownModeError(string, charIndex, modeName) {
  this.name = 'JavascriptSyntaxError';
  this.message = 'Unknown mode \'' + modeName + '\' at ' + stringUtils.lineColumnString(string, charIndex);
  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
}
UnknownModeError.prototype = Object.create(Error.prototype);

function UnknownTransformError(string, charIndex) {
  this.name = 'UnknownTransformError';
  this.message = 'Unknown transform at ' + stringUtils.lineColumnString(string, charIndex);
  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
}
UnknownTransformError.prototype = Object.create(Error.prototype);

exports.JavascriptSyntaxError = JavascriptSyntaxError;
exports.BMLSyntaxError = BMLSyntaxError;
exports.BMLNameError = BMLNameError;
exports.UnknownModeError = UnknownModeError;
exports.UnknownTransformError = UnknownTransformError;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EvalBlock = (function () {
  function EvalBlock(string) {
    _classCallCheck(this, EvalBlock);

    this.string = string;
  }

  _createClass(EvalBlock, [{
    key: "toString",
    value: function toString() {
      return "EvalBlock('" + this.string + "')";
    }
  }]);

  return EvalBlock;
})();

exports.EvalBlock = EvalBlock;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * A pseudo-replacement which instruct a Replacer to leave
 * the matched text as-is.
 *
 * This value should be used read-only.
 */
exports = Symbol('noOp');

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function defaultReplacer(match, fullText, matchIndex) {
  return match;
}

var Replacer = (function () {
  function Replacer(replacerFunction) {
    _classCallCheck(this, Replacer);

    this.replacerFunction = replacerFunction === undefined ? defaultReplacer : replacerFunction;
  }

  _createClass(Replacer, [{
    key: "call",
    value: function call(match, fullText, matchIndex) {
      for (var _len = arguments.length, options = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        options[_key - 3] = arguments[_key];
      }

      return this.replacerFunction.apply(this, [match, fullText, matchIndex].concat(options));
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Replacer{replacerFunction: " + this.replacerFunction + "}";
    }
  }]);

  return Replacer;
})();

exports.Replacer = Replacer;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Default settings. These are passed in to the main bml rendering function.
 */
var defaultSettings = {
  renderMarkdown: false,
  markdownSettings: {},
  version: null
};

/**
 * Return a new settings object with all the properties defined in newSettings,
 * defaulting to those in originalSettings where absent.
 *
 * @param {Object} originalSettings
 * @param {Object} newSettings
 * @return {void}
 */
function mergeSettings(originalSettings, newSettings) {
  var merged = JSON.parse(JSON.stringify(originalSettings));
  Object.keys(newSettings).forEach(function (key, index) {
    if (merged.hasOwnProperty(key)) {
      merged[key] = newSettings[key];
    }
  });
  return merged;
}

exports.defaultSettings = defaultSettings;
exports.mergeSettings = mergeSettings;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function lineAndColumnOf(string, charIndex) {
  if (charIndex > string.length) {
    throw new Error('charIndex > string.length');
  }
  var line = 1;
  var column = -1;
  var newLine = false;
  for (var i = 0; i <= charIndex; i++) {
    if (newLine) {
      line++;
      column = 0;
      newLine = false;
    } else {
      column++;
    }
    if (string[i] === '\n') {
      newLine = true;
    }
  }
  return { line: line, column: column };
}

function lineColumnString(string, charIndex) {
  var lineAndColumn = lineAndColumnOf(string, charIndex);
  return 'line: ' + lineAndColumn.line + ', column: ' + lineAndColumn.column;
}

function isWhitespace(string) {
  return string.trim() === '';
}

/* Escape all regex-special characters in a string */
function escapeRegExp(string) {
  return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
}

exports.lineAndColumnOf = lineAndColumnOf;
exports.lineColumnString = lineColumnString;
exports.isWhitespace = isWhitespace;
exports.escapeRegExp = escapeRegExp;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var TokenType = Object.freeze({
  WHITESPACE: Symbol('WHITESPACE'),
  NEW_LINE: Symbol('NEW_LINE'),
  COMMENT: Symbol('COMMENT'),
  OPEN_BLOCK_COMMENT: Symbol('OPEN_BLOCK_COMMENT'),
  CLOSE_BLOCK_COMMENT: Symbol('CLOSE_BLOCK_COMMENT'),
  SLASH: Symbol('SLASH'),
  ASTERISK: Symbol('ASTERISK'),
  SINGLE_QUOTE: Symbol('SINGLE_QUOTE'),
  DOUBLE_QUOTE: Symbol('DOUBLE_QUOTE'),
  BACKTICK: Symbol('BACKTICK'),
  LETTER_R: Symbol('LETTER_R'),
  OPEN_PAREN: Symbol('OPEN_PAREN'),
  CLOSE_PAREN: Symbol('CLOSE_PAREN'),
  OPEN_BRACE: Symbol('OPEN_BRACE'),
  CLOSE_BRACE: Symbol('CLOSE_BRACE'),
  COMMA: Symbol('COMMA'),
  KW_AS: Symbol('KW_AS'),
  KW_CALL: Symbol('KW_CALL'),
  KW_EVAL: Symbol('KW_EVAL'),
  KW_MODE: Symbol('KW_MODE'),
  KW_BEGIN: Symbol('KW_BEGIN'),
  KW_USE: Symbol('KW_USE'),
  NUMBER: Symbol('NUMBER'),
  TEXT: Symbol('TEXT')
});
exports.TokenType = TokenType;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["bml"] = __webpack_require__(11);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* @license BML - BSD 3 Clause License - Source and docs at https://github.com/ajyoon/bml */
let _renderer = __webpack_require__(16);

module.exports = _renderer.render;
module.exports.defaultSettings = __webpack_require__(6).defaultSettings;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Token = __webpack_require__(18).Token;
var TokenType = __webpack_require__(8).TokenType;

var Lexer = (function () {
  function Lexer(string) {
    _classCallCheck(this, Lexer);

    this.string = string;
    this.index = 0;
    this._cachedNext = null;
    this._newLineRe = new RegExp('\\r?\\n', 'y');
    this._whitespaceRe = new RegExp('\\s+', 'y');
    this._numberRe = new RegExp('(\\d+(\\.\\d+)?)|(\\.\\d+)', 'y');
  }

  /**
   * Set this.index and invalidate the next-token cache
   */

  _createClass(Lexer, [{
    key: 'overrideIndex',
    value: function overrideIndex(newIndex) {
      this._cachedNext = null;
      this.index = newIndex;
    }

    /**
     * Determine the next item in the token stream
     */
  }, {
    key: '_determineNext',
    value: function _determineNext() {
      if (this.index >= this.string.length) {
        return null;
      }
      var tokenType = undefined;
      var tokenIndex = this.index;
      var tokenString = undefined;
      this._newLineRe.lastIndex = this.index;
      this._whitespaceRe.lastIndex = this.index;
      this._numberRe.lastIndex = this.index;
      var newLineMatch = this._newLineRe.exec(this.string);
      var whitespaceMatch = this._whitespaceRe.exec(this.string);
      var numberMatch = this._numberRe.exec(this.string);
      if (newLineMatch !== null) {
        tokenType = TokenType.NEW_LINE;
        tokenString = newLineMatch[0];
      } else if (whitespaceMatch !== null) {
        tokenType = TokenType.WHITESPACE;
        tokenString = whitespaceMatch[0];
      } else if (numberMatch !== null) {
        tokenType = TokenType.NUMBER;
        tokenString = numberMatch[0];
      } else if (this.string.slice(this.index, this.index + 2) === '//') {
        tokenType = TokenType.COMMENT;
        tokenString = '//';
      } else if (this.string.slice(this.index, this.index + 2) === '/*') {
        tokenType = TokenType.OPEN_BLOCK_COMMENT;
        tokenString = '/*';
      } else if (this.string.slice(this.index, this.index + 2) === '*/') {
        tokenType = TokenType.CLOSE_BLOCK_COMMENT;
        tokenString = '*/';
      } else if (this.string[this.index] === '/') {
        tokenType = TokenType.SLASH;
        tokenString = '/';
      } else if (this.string[this.index] === '*') {
        tokenType = TokenType.ASTERISK;
        tokenString = '*';
      } else if (this.string[this.index] === '\'') {
        tokenType = TokenType.SINGLE_QUOTE;
        tokenString = '\'';
      } else if (this.string[this.index] === '"') {
        tokenType = TokenType.DOUBLE_QUOTE;
        tokenString = '"';
      } else if (this.string[this.index] === '`') {
        tokenType = TokenType.BACKTICK;
        tokenString = '`';
      } else if (this.string[this.index] === '(') {
        tokenType = TokenType.OPEN_PAREN;
        tokenString = '(';
      } else if (this.string[this.index] === ')') {
        tokenType = TokenType.CLOSE_PAREN;
        tokenString = ')';
      } else if (this.string[this.index] === '{') {
        tokenType = TokenType.OPEN_BRACE;
        tokenString = '{';
      } else if (this.string[this.index] === '}') {
        tokenType = TokenType.CLOSE_BRACE;
        tokenString = '}';
      } else if (this.string[this.index] === ',') {
        tokenType = TokenType.COMMA;
        tokenString = ',';
      } else if (this.string.slice(this.index, this.index + 2) === 'as') {
        tokenType = TokenType.KW_AS;
        tokenString = 'as';
      } else if (this.string.slice(this.index, this.index + 4) === 'call') {
        tokenType = TokenType.KW_CALL;
        tokenString = 'call';
      } else if (this.string.slice(this.index, this.index + 4) === 'eval') {
        tokenType = TokenType.KW_EVAL;
        tokenString = 'eval';
      } else if (this.string.slice(this.index, this.index + 4) === 'mode') {
        tokenType = TokenType.KW_MODE;
        tokenString = 'mode';
      } else if (this.string.slice(this.index, this.index + 5) === 'begin') {
        tokenType = TokenType.KW_BEGIN;
        tokenString = 'begin';
      } else if (this.string.slice(this.index, this.index + 3) === 'use') {
        tokenType = TokenType.KW_USE;
        tokenString = 'use';
      } else if (this.string.slice(this.index, this.index + 5) === 'using') {
        // synonym for 'use'
        tokenType = TokenType.KW_USE;
        tokenString = 'using';
      } else if (this.string[this.index] === 'r') {
        tokenType = TokenType.LETTER_R;
        tokenString = 'r';
      } else {
        tokenType = TokenType.TEXT;
        if (this.string[this.index] === '\\') {
          switch (this.string[this.index + 1]) {
            case '\\':
              tokenString = '\\\\';
              break;
            case 'n':
              tokenString = '\n';
              this.index++;
              break;
            case 't':
              tokenString = '\t';
              this.index++;
              break;
            case 'r':
              tokenString = '\r';
              this.index++;
              break;
            case '\'':
              tokenString = '\'';
              this.index++;
              break;
            case '\"':
              tokenString = '\"';
              this.index++;
              break;
            default:
              tokenString = '\\';
          }
        } else {
          tokenString = this.string[this.index];
        }
      }
      var token = new Token(tokenType, tokenIndex, tokenString);
      return token;
    }
  }, {
    key: 'next',
    value: function next() {
      var token = undefined;
      if (this._cachedNext != null) {
        token = this._cachedNext;
        this._cachedNext = null;
      } else {
        token = this._determineNext();
      }
      if (token !== null) {
        this.index += token.string.length;
      }
      return token;
    }
  }, {
    key: 'peek',
    value: function peek() {
      var token = this._determineNext();
      this._cachedNext = token;
      return token;
    }
  }, {
    key: 'skipWhitespaceAndComments',
    value: function skipWhitespaceAndComments() {
      var whitespaceTokenTypes = [TokenType.WHITESPACE, TokenType.NEW_LINE];
      var inComment = false;
      var token = undefined;
      while ((token = this.peek()) !== null) {
        if (inComment) {
          if (token.tokenType === TokenType.NEW_LINE) {
            inComment = false;
          }
        } else {
          switch (token.tokenType) {
            case TokenType.NEW_LINE:
            case TokenType.WHITESPACE:
              break;
            case TokenType.COMMENT:
              inComment = true;
              break;
            default:
              return;
          }
        }
        // consume whitespace-or-comment token
        this.next();
      }
    }
  }]);

  return Lexer;
})();

exports.Lexer = Lexer;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var prettyPrinting = __webpack_require__(15);

var Mode = (function () {
  function Mode(name) {
    _classCallCheck(this, Mode);

    this.name = name;
    this.rules = [];
  }

  _createClass(Mode, [{
    key: 'toString',
    value: function toString() {
      return 'Mode{name: \'' + this.name + '\', ' + ('rules: ' + prettyPrinting.prettyPrintArray(this.rules) + '}');
    }
  }]);

  return Mode;
})();

exports.Mode = Mode;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var _rand = __webpack_require__(0);
var _errors = __webpack_require__(2);
var _stringUtils = __webpack_require__(7);
var createRule = __webpack_require__(17).createRule;
var EvalBlock = __webpack_require__(3).EvalBlock;
var Mode = __webpack_require__(13).Mode;
var WeightedChoice = __webpack_require__(1).WeightedChoice;
var Lexer = __webpack_require__(12).Lexer;
var TokenType = __webpack_require__(8).TokenType;

var UnknownTransformError = _errors.UnknownTransformError;
var UnknownModeError = _errors.UnknownModeError;
var JavascriptSyntaxError = _errors.JavascriptSyntaxError;
var BMLSyntaxError = _errors.BMLSyntaxError;
var escapeRegExp = _stringUtils.escapeRegExp;
var createWeightedOptionReplacer = _rand.createWeightedOptionReplacer;

/**
 * Parse an `eval` block
 *
 * @param {Lexer} lexer - A lexer whose next token is KW_EVAL. This will be
 *     mutated in place such that when the method returns, the lexer's next
 *     token will be after the closing brace of the block.
 * @return {EvalBlock} An EvalBlock extracted from the block
 * @throws {BMLSyntaxError} If the lexer is not at an eval block
 * @throws {JavascriptSyntaxError} If the javascript snippet inside the eval
 *     block contains a syntax error which makes parsing it impossible.
 */
function parseEval(lexer) {
  if (lexer.peek().tokenType !== TokenType.KW_EVAL) {
    throw new BMLSyntaxError('eval blocks must start with keyword "eval"', lexer.string, lexer.index);
  }
  lexer.next(); // consume KW_EVAL
  lexer.skipWhitespaceAndComments();
  if (lexer.peek().tokenType !== TokenType.OPEN_BRACE) {
    throw new BMLSyntaxError('eval blocks must be opened with a curly brace ("{")', lexer.string, lexer.index);
  }
  lexer.next(); // consume OPEN_BRACE

  var state = 'code';
  var index = lexer.index;
  var startIndex = index;
  var openBraceCount = 1;
  var token = undefined;
  while ((token = lexer.next()) !== null) {
    switch (state) {
      case 'block comment':
        if (token.tokenType === TokenType.CLOSE_BLOCK_COMMENT) {
          state = 'code';
        }
        break;
      case 'inline comment':
        if (token.tokenType === TokenType.NEW_LINE) {
          state = 'code';
        }
        break;
      case 'template literal':
        if (token.tokenType === TokenType.BACKTICK) {
          state = 'code';
        }
        break;
      case 'single-quote string':
        if (token.tokenType === TokenType.SINGLE_QUOTE) {
          state = 'code';
        } else if (token.tokenType === TokenType.NEW_LINE) {
          throw new JavascriptSyntaxError(lexer.string, lexer.index);
        }
        break;
      case 'double-quote string':
        if (token.tokenType === TokenType.DOUBLE_QUOTE) {
          state = 'code';
        } else if (token.tokenType === TokenType.NEW_LINE) {
          throw new JavascriptSyntaxError(lexer.string, lexer.index);
        }
        break;
      case 'regexp literal':
        if (token.tokenType === TokenType.SLASH) {
          state = 'code';
        }
        break;
      case 'code':
        switch (token.tokenType) {
          case TokenType.OPEN_BRACE:
            openBraceCount++;
            break;
          case TokenType.CLOSE_BRACE:
            openBraceCount--;
            if (openBraceCount < 1) {
              return lexer.string.slice(startIndex, lexer.index - 1);
            }
            break;
          case TokenType.COMMENT:
            state = 'inline comment';
            break;
          case TokenType.OPEN_BLOCK_COMMENT:
            state = 'block comment';
            break;
          case TokenType.BACKTICK:
            state = 'template literal';
            break;
          case TokenType.SINGLE_QUOTE:
            state = 'single-quote string';
            break;
          case TokenType.DOUBLE_QUOTE:
            state = 'double-quote string';
            break;
          case TokenType.SLASH:
            state = 'regexp literal';
            break;
          default:
          // pass over..
        }
        break;
      default:
        throw new Error('Invalid state: ' + state);
    }
  }
  throw new BMLSyntaxError('could not find end of `eval` block', lexer.string, startIndex);
}

function createMatcher(string, isRegex) {
  if (isRegex) {
    return new RegExp(string, 'y');
  } else {
    return new RegExp(escapeRegExp(string), 'y');
  }
}

/**
 * @returns {[RegExp]}
 */
function parseMatchers(lexer) {
  var startIndex = lexer.index;
  var token = undefined;
  var afterLetterR = false;
  var acceptMatcher = true;
  var inComment = false;
  var matchers = [];
  while ((token = lexer.peek()) !== null) {
    if (inComment) {
      if (token.tokenType === TokenType.NEW_LINE) {
        inComment = false;
      }
    } else if (afterLetterR && !(token.tokenType === TokenType.SINGLE_QUOTE || token.tokenType === TokenType.DOUBLE_QUOTE)) {
      throw new BMLSyntaxError('regex matcher signifier (\'r\') not ' + 'immediately preceding string literal', lexer.string, startIndex);
    } else {
      switch (token.tokenType) {
        case TokenType.WHITESPACE:
        case TokenType.NEW_LINE:
          break;
        case TokenType.COMMENT:
          inComment = true;
          break;
        case TokenType.KW_AS:
          return matchers;
        case TokenType.SINGLE_QUOTE:
        case TokenType.DOUBLE_QUOTE:
          if (acceptMatcher) {
            matchers.push(createMatcher(parseStringLiteralWithLexer(lexer), afterLetterR));
            afterLetterR = false;
            acceptMatcher = false;
            // break out of loop since the string literal token
            // stream has already been consumed.
            continue;
          } else {
            throw new BMLSyntaxError('unexpected string literal.', lexer.string, token.index);
          }
          break;
        case TokenType.COMMA:
          acceptMatcher = true;
          break;
        case TokenType.LETTER_R:
          if (afterLetterR) {
            throw new BMLSyntaxError('Cannot have two consecutive LETTER_R tokens.', lexer.string, token.index);
          }
          afterLetterR = true;
          break;
        default:
          throw new BMLSyntaxError('Unexpected token ' + token, lexer.string, token.index);
      }
    }
    // If we haven't broken out or thrown an error by now, consume this token.
    lexer.next();
  }
  throw new BMLSyntaxError('Could not find end of matcher.', lexer.string, startIndex);
}

function parseCall(lexer) {
  var callRe = new RegExp('call\\s+([_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*)', 'y');
  callRe.lastIndex = lexer.index;
  var callMatch = callRe.exec(lexer.string);
  if (callMatch === null) {
    throw new BMLSyntaxError('invalid call statement', lexer.string, lexer.index);
  }
  lexer.overrideIndex(lexer.index + callMatch[0].length);
  return new EvalBlock(callMatch[1]);
}

function parseReplacements(lexer) {
  var startIndex = lexer.index;
  var token = undefined;
  var inComment = false;
  var choices = [];
  var acceptReplacement = true;
  var acceptWeight = false;
  var acceptComma = false;
  var acceptReplacerEnd = false;

  while ((token = lexer.peek()) !== null) {
    if (inComment) {
      if (token.tokenType === TokenType.NEW_LINE) {
        inComment = false;
      }
    } else {
      switch (token.tokenType) {
        case TokenType.WHITESPACE:
        case TokenType.NEW_LINE:
          break;
        case TokenType.COMMENT:
          inComment = true;
          break;
        case TokenType.SINGLE_QUOTE:
        case TokenType.DOUBLE_QUOTE:
          if (acceptReplacement) {
            acceptReplacement = false;
            acceptWeight = true;
            acceptComma = true;
            acceptReplacerEnd = true;
            choices.push(new WeightedChoice(parseStringLiteralWithLexer(lexer), null));
            // break out of loop since the string literal token
            // stream is consumed by parseStringLiteralWithLexer
            continue;
          } else if (acceptReplacerEnd) {
            return choices;
          } else {
            throw new BMLSyntaxError('unexpected string literal', lexer.string, token.index);
          }
        case TokenType.CLOSE_BRACE:
        case TokenType.LETTER_R:
          if (acceptReplacerEnd) {
            return choices;
          } else {
            throw new BMLSyntaxError('unexpected end of replacer: ' + token.tokenType, lexer.string, token.index);
          }
        case TokenType.KW_CALL:
          if (acceptReplacement) {
            acceptReplacement = false;
            acceptWeight = true;
            acceptComma = true;
            acceptReplacerEnd = true;
            choices.push(new WeightedChoice(parseCall(lexer), null));
          } else {
            throw new BMLSyntaxError('unexpected call statement.', lexer.string, token.index);
          }
          continue;
        case TokenType.NUMBER:
          if (acceptWeight) {
            acceptWeight = false;
            acceptComma = true;
            acceptReplacerEnd = true;
            choices[choices.length - 1].weight = Number(token.string);
          } else {
            throw new BMLSyntaxError('unexpected number literal.', lexer.string, token.index);
          }
          break;
        case TokenType.COMMA:
          if (acceptComma) {
            acceptComma = false;
            acceptReplacement = true;
            acceptWeight = false;
            acceptReplacerEnd = false;
          } else {
            throw new BMLSyntaxError('unexpected comma.', lexer.string, token.index);
          }
          break;
        default:
          throw new BMLSyntaxError('Unexpected token ' + token, lexer.string, token.index);
      }
    }
    // If we haven't broken out or thrown an error by now, consume this token.
    lexer.next();
  }
  throw new BMLSyntaxError('Could not find end of replacer.', lexer.string, startIndex);
}

function parseRule(lexer) {
  var matchers = parseMatchers(lexer);
  if (lexer.peek().tokenType !== TokenType.KW_AS) {
    throw new BMLSyntaxError('matchers must be followed with keyword "as"', lexer.string, lexer.index);
  }
  lexer.next(); // consume KW_AS
  var replacements = parseReplacements(lexer);
  return createRule(matchers, replacements);
}

function parseMode(lexer) {
  var startIndex = lexer.index;
  if (lexer.peek().tokenType !== TokenType.KW_MODE) {
    throw new BMLSyntaxError('modes must begin with keyword "mode"', lexer.string, lexer.index);
  }
  var token = lexer.next(); // consume KW_MODE
  var modeNameRe = new RegExp('(\\s*(\\w+)\\s*)', 'y');
  modeNameRe.lastIndex = lexer.index;
  var modeNameMatch = modeNameRe.exec(lexer.string);
  var mode = new Mode(modeNameMatch[2]);
  lexer.overrideIndex(lexer.index + modeNameMatch[1].length);

  if (lexer.peek().tokenType !== TokenType.OPEN_BRACE) {
    throw new BMLSyntaxError('modes must be opened with a curly brace ("{")', lexer.string, lexer.index);
  }
  lexer.next(); // consume open brace

  var inComment = false;
  while ((token = lexer.peek()) !== null) {
    if (inComment) {
      if (token.tokenType === TokenType.NEW_LINE) {
        inComment = false;
      }
    } else {
      switch (token.tokenType) {
        case TokenType.WHITESPACE:
        case TokenType.NEW_LINE:
          break;
        case TokenType.COMMENT:
          inComment = true;
          break;
        case TokenType.SINGLE_QUOTE:
        case TokenType.DOUBLE_QUOTE:
        case TokenType.LETTER_R:
          mode.rules.push(parseRule(lexer));
          continue;
        case TokenType.CLOSE_BRACE:
          // consume closing brace
          lexer.next();
          return mode;
        default:
          throw new BMLSyntaxError('Unexpected token ' + token, lexer.string, token.index);
      }
    }
    // Accept and consume the token
    lexer.next();
  }
  throw new BMLSyntaxError('Could not find end of mode', lexer.string, startIndex);
}

function parsePrelude(string) {
  var lexer = new Lexer(string);
  var inComment = false;
  var evalString = '';
  var modes = {};
  var token = undefined;
  while ((token = lexer.peek()) !== null) {
    if (inComment) {
      if (token.tokenType === TokenType.NEW_LINE) {
        inComment = false;
      }
    } else {
      switch (token.tokenType) {
        case TokenType.WHITESPACE:
        case TokenType.NEW_LINE:
          break;
        case TokenType.COMMENT:
          inComment = true;
          break;
        case TokenType.KW_EVAL:
          evalString += parseEval(lexer) + '\n';
          continue;
        case TokenType.KW_MODE:
          var newMode = parseMode(lexer);
          modes[newMode.name] = newMode;
          continue;
        case TokenType.KW_BEGIN:
          var beginStatementStartIndex = lexer.index;
          var initialModeName = parseBegin(lexer);
          var initialMode;
          if (modes.hasOwnProperty(initialModeName)) {
            initialMode = modes[initialModeName];
          } else if (initialModeName === null) {
            initialMode = null;
          } else if (initialModeName !== null) {
            throw new UnknownModeError(lexer.string, beginStatementStartIndex, initialModeName);
          }
          return {
            preludeEndIndex: lexer.index,
            evalBlock: new EvalBlock(evalString),
            modes: modes,
            initialMode: initialMode
          };
      }
    }
    lexer.next();
  }
  // Could not find end of prelude; assume that none exists
  return {
    preludeEndIndex: 0,
    evalBlock: new EvalBlock(''),
    modes: {},
    initialMode: null
  };
}

/**
 * Parse a `use` block of the form `{{use|using modeName}}`
 *
 * @returns {blockEndIndex, modeName} The returned index is the index immediately
 * after the closing brace.
 */
function parseUse(string, openBraceIndex) {
  var useRe = new RegExp('{{(use|using)\\s+(\\w[\\w\\d]*)\\s*}}', 'y');
  useRe.lastIndex = openBraceIndex;
  var match = useRe.exec(string);
  if (match === null) {
    throw new UnknownTransformError(string, openBraceIndex);
  }
  return {
    blockEndIndex: useRe.lastIndex,
    modeName: match[2]
  };
}

function parseBegin(lexer) {
  if (lexer.peek().tokenType !== TokenType.KW_BEGIN) {
    throw new BMLSyntaxError('begin statements must start with keyword "begin"', lexer.string, lexer.index);
  }
  var token = lexer.next();
  var useRe = new RegExp('\\s+(use|using)\\s+(\\w[\\w\\d]*)', 'y');
  useRe.lastIndex = lexer.index;
  var match = useRe.exec(lexer.string);
  if (match !== null) {
    lexer.overrideIndex(lexer.index + match[0].length);
    return match[2];
  } else {
    return match;
  }
}

/**
 * @param lexer {Lexer} a lexer whose next token is either TokenType.SINGLE_QUOTE
 * or TokenType.DOUBLE_QUOTE.
 *
 * @return {String} the parsed string literal.
 */
function parseStringLiteralWithLexer(lexer) {
  var startIndex = lexer.index;
  var stringLiteral = '';
  var token = undefined;
  var openStringToken = lexer.next();
  while ((token = lexer.next()) !== null) {
    if (token.tokenType === openStringToken.tokenType) {
      return stringLiteral;
    }
    stringLiteral += token.string;
  }
  throw new BMLSyntaxError('Could not find end of string.', lexer.string, startIndex);
}

// TODO: use me in similar logic in other parsers
// {closeQuoteIndex, extractedString}
function parseStringLiteral(string, openQuoteIndex) {
  var index = openQuoteIndex + 1;
  var isEscaped = false;
  while (index < string.length) {
    if (isEscaped) {
      isEscaped = false;
    } else {
      if (string[index] === '\\') {
        isEscaped = true;
      } else if (string[index] === '\'') {
        return {
          closeQuoteIndex: index,
          extractedString: string.slice(openQuoteIndex + 1, index)
        };
      }
    }
    index++;
  }
  throw new BMLSyntaxError('could not find end of string at index: ' + openQuoteIndex);
}

// {lastDigitIndex, extractedNumber}
function extractNumberLiteral(string, numberIndex) {
  var numberRe = new RegExp('(\\d+(\\.\\d+)?)|(\\.\\d+)', 'y');
  numberRe.lastIndex = numberIndex;
  var match = numberRe.exec(string);
  if (match === null) {
    return null;
  }
  return {
    lastDigitIndex: numberIndex + match[0].length,
    extractedNumber: Number(match[0])
  };
}

function parseInlineChoose(string, openBraceIndex) {
  var lexer = new Lexer(string);
  lexer.overrideIndex(openBraceIndex + 2);
  var replacements = parseReplacements(lexer);
  return {
    blockEndIndex: lexer.index + 2,
    replacer: createWeightedOptionReplacer(replacements, false)
  };
}

exports.parseEval = parseEval;
exports.parseRule = parseRule;
exports.parseMode = parseMode;
exports.parsePrelude = parsePrelude;
exports.parseUse = parseUse;
exports.parseStringLiteral = parseStringLiteral;
exports.parseStringLiteralWithLexer = parseStringLiteralWithLexer;
exports.parseInlineChoose = parseInlineChoose;
exports.createMatcher = createMatcher;
exports.parseMatchers = parseMatchers;
exports.parseCall = parseCall;
exports.parseReplacements = parseReplacements;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

function prettyPrintArray(array) {
  if (array.length == 0) {
    return '[]';
  }
  return '[' + array.join(', ') + ']';
}

exports.prettyPrintArray = prettyPrintArray;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var marked = __webpack_require__(19);

var _parsers = __webpack_require__(14);
var _settings = __webpack_require__(6);
var _errors = __webpack_require__(2);
var _rand = __webpack_require__(0);

var defaultSettings = _settings.defaultSettings;
var mergeSettings = _settings.mergeSettings;
var parsePrelude = _parsers.parsePrelude;
var parseUse = _parsers.parseUse;
var parseInlineChoose = _parsers.parseInlineChoose;
var EvalBlock = __webpack_require__(3).EvalBlock;
var noOp = __webpack_require__(4);
var UnknownModeError = _errors.UnknownModeError;
var BML_VERSION = __webpack_require__(20)['version'];

// imports for exposure to eval blocks
/* eslint-disable no-unused-vars */
var WeightedChoice = __webpack_require__(1).WeightedChoice;
var weightedChoose = _rand.weightedChoose;
/* eslint-enable no-unused-vars */

/**
 * Check if the running version of bml aligns with a specified one.
 *
 * If the versions do not align, log a warning to the console.
 *
 * @return {void}
 */
function checkVersion(bmlVersion, specifiedInSettings) {
  if (specifiedInSettings !== null && specifiedInSettings !== bmlVersion) {
    if (specifiedInSettings !== BML_VERSION) {
      console.warn('BML VERSION MISMATCH.' + ' bml source file specifies version ' + specifiedInSettings + ' but running version is ' + BML_VERSION + '.' + ' unexpected behavior may occur.');
    }
  } else {
    console.warn('no bml version specified in settings, unexpected behavior may occur.');
  }
}

/**
 * The main loop which processes the text component of a bml document.
 *
 * Iterates through the body of the text exactly once, applying rules
 * whenever a matching string is encountered. Rules are processed in
 * the order they are listed in the active mode's declaration.
 *
 * If markdown postprocessing is enabled, it will be called at the end
 * of rule processing.
 *
 * @returns {String} the rendered text.
 */
function renderText(string, startIndex, evalBlock, modes, activeMode) {
  var isEscaped = false;
  var inLiteralBlock = false;
  var out = '';
  var index = startIndex;
  var currentRule = null;
  var foundMatch = false;
  var replacement = null;
  var chooseRe = new RegExp('\\s*([\'"]|call)', 'y');
  var useRe = new RegExp('\\s*(use|using)', 'y');

  if (evalBlock) {
    eval(evalBlock.string);
  }

  if (settings) {
    settings = mergeSettings(defaultSettings, settings);
  } else {
    var settings = defaultSettings;
  }

  checkVersion(BML_VERSION, settings.version);

  while (index < string.length) {
    if (isEscaped) {
      isEscaped = false;
      out += string[index];
    } else if (inLiteralBlock) {
      if (string[index] === '\\') {
        isEscaped = true;
      } else if (string.slice(index, index + 2) === ']]') {
        inLiteralBlock = false;
        index += 2;
        continue;
      } else {
        out += string[index];
      }
    } else if (string.slice(index, index + 2) === '{{') {
      chooseRe.lastIndex = index + 2;
      useRe.lastIndex = index + 2;
      if (chooseRe.test(string)) {
        var parseInlineChooseResult = parseInlineChoose(string, index, false);
        replacement = parseInlineChooseResult.replacer.call([''], string, index);
        if (replacement instanceof EvalBlock) {
          out += eval(replacement.string)([''], string, index);
        } else {
          out += replacement;
        }
        index = parseInlineChooseResult.blockEndIndex;
        continue;
      } else if (useRe.test(string)) {
        var parseUseResult = parseUse(string, index);
        index = parseUseResult.blockEndIndex;
        if (modes.hasOwnProperty(parseUseResult.modeName)) {
          activeMode = modes[parseUseResult.modeName];
        } else {
          throw new UnknownModeError(string, index, parseUseResult.modeName);
        }
      }
    } else {
      if (string[index] === '\\') {
        isEscaped = true;
      } else if (string.slice(index, index + 2) === '[[') {
        index++;
        inLiteralBlock = true;
      } else {
        if (activeMode !== null) {
          ruleLoop: for (var r = 0; r < activeMode.rules.length; r++) {
            currentRule = activeMode.rules[r];
            for (var m = 0; m < currentRule.matchers.length; m++) {
              currentRule.matchers[m].lastIndex = index;
              var currentMatch = currentRule.matchers[m].exec(string);
              if (currentMatch !== null) {
                replacement = currentRule.replacer.call(currentRule.matchers[m], string, index);
                if (replacement instanceof EvalBlock) {
                  out += eval(replacement.string)(currentMatch, string, index);
                } else if (replacement === noOp) {
                  out += currentMatch[0];
                } else {
                  out += replacement;
                }
                index += currentMatch[0].length;
                foundMatch = true;
                break ruleLoop;
              }
            }
          }
        }
        if (foundMatch) {
          foundMatch = false;
          continue;
        } else {
          out += string[index];
        }
      }
    }
    index++;
  }

  if (settings.renderMarkdown) {
    out = marked(out, settings.markdownSettings);
  }
  return out;
}

/**
 * render a bml document.
 *
 * @param {String} bmlDocumentString - the bml text to process.
 * @return {String} the processed and rendered text.
 */
function render(bmlDocumentString) {
  var _parsePrelude = parsePrelude(bmlDocumentString);

  var preludeEndIndex = _parsePrelude.preludeEndIndex;
  var evalBlock = _parsePrelude.evalBlock;
  var modes = _parsePrelude.modes;
  var initialMode = _parsePrelude.initialMode;

  return renderText(bmlDocumentString, preludeEndIndex, evalBlock, modes, initialMode);
}

exports.renderText = renderText;
exports.render = render;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var rand = __webpack_require__(0);
var Replacer = __webpack_require__(5).Replacer;

var Rule = (function () {
  function Rule(matchers) {
    _classCallCheck(this, Rule);

    this.matchers = matchers;
    // Default replacer is a no-op
    this.replacer = new Replacer(function (match) {
      return match;
    });
  }

  _createClass(Rule, [{
    key: 'toString',
    value: function toString() {
      return 'Rule{matchers: ' + this.matchers + ', replacer: ' + this.replacer + '}';
    }
  }]);

  return Rule;
})();

function createRule(matchers, choices) {
  var rule = new Rule(matchers);
  rule.replacer = rand.createWeightedOptionReplacer(choices, true);
  return rule;
}

exports.createRule = createRule;
exports.Rule = Rule;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Token = (function () {
  function Token(tokenType, index, string) {
    _classCallCheck(this, Token);

    this.tokenType = tokenType;
    this.index = index;
    this.string = string;
  }

  _createClass(Token, [{
    key: "toString",
    value: function toString() {
      return "Token{tokenType: " + this.tokenType.toString().slice(7, -1) + ", index: " + this.index + ", " + ("string: '" + this.string + "'}");
    }
  }]);

  return Token;
})();

exports.Token = Token;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)([\s\S]*?[^`])\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = escape(
          cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1])
        );
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2].trim(), true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return '';
    }
  }
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  if (this.options.baseUrl && !originIndependentUrl.test(href)) {
    href = resolveUrl(this.options.baseUrl, href);
  }
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[^]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[^]*/, '$1') + href;
  } else {
    return base + href;
  }
}
baseUrls = {};
originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false,
  baseUrl: null
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (true) {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = {"name":"bml","version":"0.0.11-dev","description":"A stochastic markup language","author":{"name":"Andrew Yoon","email":"andrewyoon2@gmail.com","url":"http://andrewjyoon.com"},"man":"./man/bml.1","repository":{"type":"git","url":"https://github.com/ajyoon/bml"},"bugs":{"url":"https://github.com/ajyoon/bml/issues"},"main":"bml.js","bin":{"bml":"./cli.js"},"scripts":{"test":"./node_modules/.bin/mocha","build":"./node_modules/.bin/webpack --config ./webpack.config.bml.js","buildHighlighting":"./node_modules/.bin/webpack --config ./webpack.config.bmlHighlighting.js","lint":"./node_modules/.bin/eslint .","test-with-coverage":"./node_modules/.bin/nyc npm test","test-with-coverage-html":"./node_modules/.bin/nyc --reporter=html npm test"},"devDependencies":{"babel-core":"~5","babel-loader":"^7.1.3","chai":"^4.0.2","eslint":"^3.19.0","eslint-config-google":"^0.8.0","expose-loader":"^0.7.4","mocha":"3.4.1","nyc":"^11.4.1","uglifyjs-webpack-plugin":"^1.2.2","webpack":"~2"},"dependencies":{"highlight.js":"9.12.0","marked":"0.3.9"},"license":"BSD-3-Clause"}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ })
/******/ ]);