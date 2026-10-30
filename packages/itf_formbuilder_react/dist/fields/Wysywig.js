"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
function checkAndGetReactSelect(thirdPartyComponents) {
    if (thirdPartyComponents &&
        thirdPartyComponents.CKEditor &&
        thirdPartyComponents.CKEditorEditorBuild)
        return {
            CKEditor: thirdPartyComponents.CKEditor,
            CKEditorEditorBuild: thirdPartyComponents.CKEditorEditorBuild
        };
    console.error("###########\nUsing Wysywig with ItfFormBuilder requires CKEditor and CKEEditor editor build! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.CKEditor and thirdPartyComponents.CKEditorEditorBuild.\n\n# The simplest is by using with Webpack/bundler:\n    \nyarn add @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic\nor\nnpm i -S @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic\n\n# To slience typing errors (CKEditor has no types):\n\nCreate/add to vendor.d.ts:\ndeclare module '@ckeditor/ckeditor5-react';\ndeclare module '@ckeditor/ckeditor5-build-classic';\n\n# Then:\n\nimport CKEditor from '@ckeditor/ckeditor5-react';\nimport CKEditorEditorBuild from '@ckeditor/ckeditor5-build-classic'; // For example. Check out other builds: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html\n\n# Then pass it like this:\n\n<ItfFormBuilder/ItfApiForm\n    {/* ... */}\n    thirdPartyComponents={{CKEditor, CKEditorEditorBuild}}\n/>\n\n\n#");
    throw new Error("Using Wysywig with ItfFormBuilder requires CKEditor and CKEEditor editor build! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.CKEditor and thirdPartyComponents.CKEditorEditorBuild.");
}
function Wysywig(props) {
    var onChange = props.onChange, currentValue = props.currentValue, fieldHtmlId = props.fieldHtmlId, onFocus = props.onFocus, onBlur = props.onBlur;
    var _a = checkAndGetReactSelect(props.thirdPartyComponents), CKEditor = _a.CKEditor, CKEditorEditorBuild = _a.CKEditorEditorBuild;
    return (React.createElement(CKEditor, { editor: CKEditorEditorBuild, id: fieldHtmlId, data: currentValue, onChange: function (event, editor) {
            var data = editor.getData();
            onChange && onChange(data);
        }, onFocus: onFocus, onBlur: onBlur }));
}
exports.Wysywig = Wysywig;
