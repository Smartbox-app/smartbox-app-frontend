import React from 'react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';

const ReactSelectOverride = (props: React.ComponentProps<typeof ReactSelect>) => (
    <ReactSelect
        {...props}
        menuPortalTarget={document.querySelector('body')}
        menuShouldBlockScroll={true}
        menuPlacement="auto"
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
);

const ReactCreatableSelectOverride = (
  props: React.ComponentProps<typeof ReactCreatableSelect>,
) => (
    <ReactCreatableSelect
        {...props}
        menuPortalTarget={document.querySelector('body')}
        menuShouldBlockScroll={true}
        menuPlacement="auto"
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
    />
);

export {ReactSelectOverride, ReactCreatableSelectOverride };
