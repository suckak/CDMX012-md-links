#!/usr/bin/env node
"use strict";
var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));
var _chalk = _interopRequireDefault(require("chalk"));
var _inquirer = _interopRequireDefault(require("inquirer"));
var _gradientString = _interopRequireDefault(require("gradient-string"));
var _chalkAnimation = _interopRequireDefault(require("chalk-animation"));
var _figlet = _interopRequireDefault(require("figlet"));
var _nanospinner = require("nanospinner");
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
var sleep = function() {
    var ms = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 500;
    return new Promise(function(r) {
        return setTimeout(r, ms);
    });
};
var _argv = _toArray(process.argv), path = _argv[2], option1 = _argv[3], option2 = _argv[4], othersOptions = _argv.slice(5);
function welcome() {
    return _welcome.apply(this, arguments);
}
function _welcome() {
    _welcome = _asyncToGenerator(_regeneratorRuntime.default.mark(function _callee() {
        var rainbowTitle;
        return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    rainbowTitle = _chalkAnimation.default.rainbow("\n   /$$      /$$ /$$$$$$$          /$$       /$$$$$$ /$$   /$$ /$$   /$$  /$$$$$$\n  | $$$    /$$$| $$__  $$       | $$       |_  $$_/| $$$ | $$| $$  /$$/ /$$__  $$\n  | $$$$  /$$$$| $$   $$         | $$        | $$  | $$$$| $$| $$ /$$/ | $$  __/\n  | $$ $$/$$ $$| $$  | $$ /$$$$$$| $$        | $$  | $$ $$ $$| $$$$$/  |  $$$$$$\n  | $$  $$$| $$| $$  | $$|______/| $$        | $$  | $$  $$$$| $$  $$   ____  $$\n  | $$  $  | $$| $$  | $$        | $$        | $$  | $$   $$$| $$   $$  /$$   $$\n  | $$ /   | $$| $$$$$$$/        | $$$$$$$$ /$$$$$$| $$    $$| $$   $$|  $$$$$$/\n  |__/     |__/|_______/         |________/|______/|__/  __/|__/  __/ ______/\n    \n");
                    _ctx.next = 3;
                    return sleep();
                case 3:
                    rainbowTitle.stop();
                    console.log("\n    ".concat(_chalk.default.bgBlue("Hola!"), "\n    Esta ").concat(_chalk.default.bgRed("CLI"), " te ayudar\xe1 a encontrar y validar los links de tus archivos .MD\n  "));
                case 5:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _welcome.apply(this, arguments);
}
function handleAnswer(isCorrect) {
    return _handleAnswer.apply(this, arguments);
}
function _handleAnswer() {
    _handleAnswer = _asyncToGenerator(_regeneratorRuntime.default.mark(function _callee(isCorrect) {
        var spinner;
        return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    spinner = (0, _nanospinner).createSpinner("Checking answer...").start();
                    _ctx.next = 3;
                    return sleep();
                case 3:
                    if (isCorrect) {
                        spinner.success({
                            text: "Nice work ".concat(playerName, ". That's a legit answer")
                        });
                    } else {
                        spinner.error({
                            text: "\uD83D\uDC80\uD83D\uDC80\uD83D\uDC80 Game over, you lose ".concat(playerName, "!")
                        });
                        process.exit(1);
                    }
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return _handleAnswer.apply(this, arguments);
}
var validateOptions = function() {
    var validateSingleOption = function(single) {
        return single === "" || single === "--validate" || single === "--stats";
    };
    if (!validateSingleOption(option1) || !validateSingleOption(option2) || othersOptions.length) {
        console.log(_chalk.default.bgRed("HEY!, pusiste una opci\xf3n no valida, recuerda que solo puedes usar --validate y/o --stats"));
        process.exit(1);
    }
};
_asyncToGenerator(_regeneratorRuntime.default.mark(function _callee() {
    return _regeneratorRuntime.default.wrap(function _callee$(_ctx) {
        while(1)switch(_ctx.prev = _ctx.next){
            case 0:
                console.clear();
                _ctx.next = 3;
                return welcome();
            case 3:
                validateOptions();
            case 4:
            case "end":
                return _ctx.stop();
        }
    }, _callee);
//await askPath();
}))();


//# sourceMappingURL=cli.js.map