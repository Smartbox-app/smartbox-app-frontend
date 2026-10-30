import * as React from "react";
import { FormFieldToRender, ThirdPartyComponents } from "../ItfFormBuilder";
import { eventTargetValueExtractor } from "../utils/eventTargetValueExtractor";

interface Props {
  onChange: (currentValue: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  currentValue: any;
  fieldHtmlId: string;
  field: FormFieldToRender;
  thirdPartyComponents: ThirdPartyComponents;
}

function checkAndGetReactSelect(thirdPartyComponents: ThirdPartyComponents) {
  if (
    thirdPartyComponents &&
    thirdPartyComponents.CKEditor &&
    thirdPartyComponents.CKEditorEditorBuild
  )
    return {
      CKEditor: thirdPartyComponents.CKEditor,
      CKEditorEditorBuild: thirdPartyComponents.CKEditorEditorBuild
    };

  console.error(`###########
Using Wysywig with ItfFormBuilder requires CKEditor and CKEEditor editor build! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.CKEditor and thirdPartyComponents.CKEditorEditorBuild.

# The simplest is by using with Webpack/bundler:
    
yarn add @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
or
npm i -S @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic

# To slience typing errors (CKEditor has no types):

Create/add to vendor.d.ts:
declare module '@ckeditor/ckeditor5-react';
declare module '@ckeditor/ckeditor5-build-classic';

# Then:

import CKEditor from '@ckeditor/ckeditor5-react';
import CKEditorEditorBuild from '@ckeditor/ckeditor5-build-classic'; // For example. Check out other builds: https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html

# Then pass it like this:

<ItfFormBuilder/ItfApiForm
    {/* ... */}
    thirdPartyComponents={{CKEditor, CKEditorEditorBuild}}
/>


#`);

  throw new Error(
    "Using Wysywig with ItfFormBuilder requires CKEditor and CKEEditor editor build! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.CKEditor and thirdPartyComponents.CKEditorEditorBuild."
  );
}

export function Wysywig(props: Props) {
  const { onChange, currentValue, fieldHtmlId, onFocus, onBlur } = props;

  const { CKEditor, CKEditorEditorBuild } = checkAndGetReactSelect(
    props.thirdPartyComponents
  );

  return (
    <CKEditor
      editor={CKEditorEditorBuild}
      id={fieldHtmlId}
      data={currentValue}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        onChange && onChange(data);
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
