"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
// const adaptFileEventToValue = (delegate: any) => (e: any) => delegate((e && e.target && e.target.files) ? e.target.files[0] : e);
var EMPTY_IMG_SRC = "data:image/gif;base64,R0lGODlhAQABAAAAADs=";
var FileDragDrop = /** @class */ (function (_super) {
    __extends(FileDragDrop, _super);
    function FileDragDrop(props) {
        var _this = _super.call(this, props) || this;
        _this.onChange = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.props.onChange(e.target.files[0]);
            if (e.target.files && e.target.files[0]) {
                _this.setState({
                    imgFileName: e.target.files[0].name
                });
                _this.fileReader.onload = function (e) {
                    _this.setState({
                        currentImg: e.target.result,
                        imgStatus: true
                    });
                };
                _this.fileReader.readAsDataURL(e.target.files[0]);
            }
        };
        _this.onDrop = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files[0]) {
                _this.setState({
                    imgFileName: e.dataTransfer.files[0].name,
                    dragging: false
                });
                _this.props.onBlur && _this.props.onBlur();
                _this.fileReader.onload = function (e) {
                    _this.setState({
                        currentImg: e.target.result,
                        imgStatus: true
                    });
                };
            }
            _this.fileReader.readAsDataURL(e.dataTransfer.files[0]);
            _this.props.onChange(e.dataTransfer.files[0]);
        };
        _this.onDragEnter = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.setState({
                dragging: true
            });
            _this.props.onFocus && _this.props.onFocus();
        };
        _this.onDragLeave = function (e) {
            e.preventDefault();
            e.stopPropagation();
            _this.setState({
                dragging: false
            });
            _this.props.onBlur && _this.props.onBlur();
        };
        _this.hasImage = function () {
            return _this.props.currentValue || _this.props.field.options.previewUrl;
        };
        _this.state = {
            currentImg: null,
            imgFileName: "",
            imgStatus: false,
            dragging: false
        };
        _this.fileReader = new FileReader();
        return _this;
    }
    FileDragDrop.prototype.getImgPreviewSrc = function () {
        if (typeof this.state.currentImg === "string") {
            return this.state.currentImg;
        }
        if (typeof this.props.currentValue === "string") {
            return this.props.currentValue;
        }
        if (typeof this.props.field.options.previewUrl === "string") {
            return this.props.field.options.previewUrl + "?_t=" + +new Date();
        }
        return EMPTY_IMG_SRC;
    };
    FileDragDrop.prototype.render = function () {
        var transPlainStr = this.props.transPlainStr;
        var imgPreview = (React.createElement("div", { className: "img-preview-wrapper" },
            React.createElement("p", { className: "file-name" }, this.state.imgFileName),
            React.createElement("img", { className: "img-preview", src: this.getImgPreviewSrc(), alt: "" })));
        return (React.createElement(React.Fragment, null,
            React.createElement("label", { className: "input-container" },
                React.createElement("div", { onDrop: this.onDrop, onDragEnter: this.onDragEnter, onDragOver: this.onDragEnter, onDragLeave: this.onDragLeave, className: "file-container " + (this.state.dragging ? "dragging" : "") },
                    React.createElement("div", { className: "file-wrapper " + (this.hasImage() ? "has-image" : "") },
                        this.hasImage() ? (imgPreview) : (React.createElement("span", null, transPlainStr("Drag & drop or click here to select file."))),
                        React.createElement("input", __assign({}, (this.props.field.options.isNotImage !== true
                            ? { accept: this.props.field.options.accept || "image/*" }
                            : { accept: this.props.field.options.accept || "*" }), { className: "input input-file", id: this.props.fieldHtmlId, type: "file", onChange: this.onChange })),
                        " ")))));
    };
    return FileDragDrop;
}(React.Component));
exports.default = FileDragDrop;
