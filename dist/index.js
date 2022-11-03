"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _nodeFs = _interopRequireDefault(require("node:fs"));
var _axios = _interopRequireDefault(require("axios"));
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
var mdLinks = function(path) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        validate: false
    };
    return new Promise(function(resolve, reject) {
        if (!path) {
            reject(new Error("No path"));
        }
        if (!_nodeFs.default.existsSync(path)) {
            reject(new Error("No existe el path"));
        }
        if (!_path.default.isAbsolute(path)) {
            path = _path.default.resolve(path);
        }
        var files = getFiles(path).filter(function(file) {
            return file.substr(-3) === ".md";
        });
        if (files.length < 1) {
            reject(new Error("no .md file"));
        }
        var links = [];
        files.map(function(file) {
            var _links;
            var data = _nodeFs.default.readFileSync(file, "utf8");
            (_links = links).push.apply(_links, _toConsumableArray(getLinks(data, file)));
        });
        if (options.validate) {
            resolve(Promise.all(links.map(function(link) {
                return validate(link);
            })));
        }
        resolve(links);
    });
};
var getFiles = function(path) {
    if (_nodeFs.default.lstatSync(path).isDirectory()) {
        var files = _nodeFs.default.readdirSync(path);
        return files.map(function(file) {
            return getFiles("".concat(path, "/").concat(file));
        }).flat();
    } else {
        return [
            path
        ];
    }
};
var getLinks = function(content, file) {
    var regexMdLinks = /\[([^\[]+)\](\(.*\))/gm;
    var matches = content.match(regexMdLinks);
    return matches.filter(function(mat) {
        return mat.includes("http");
    }).map(function(result) {
        var arr = result.split("]");
        return {
            text: arr[0].replace("[", "").replace("]", ""),
            href: arr[1].replace("(", "").replace(")", ""),
            file: file
        };
    });
};
var validate = function(link) {
    var href = link.href;
    var responseHandler = function(response) {
        return _objectSpread({}, link, {
            status: response.status,
            ok: response.statusText || "fail"
        });
    };
    return _axios.default.get(href).then(responseHandler, responseHandler);
};
mdLinks("./dir/", {
    validate: true
}).then(console.log).catch(console.error);
var _default = mdLinks;
exports.default = _default;


//# sourceMappingURL=index.js.map