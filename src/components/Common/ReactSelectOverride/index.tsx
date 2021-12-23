import React from 'react';
import ReactSelect from 'react-select';

const ReactSelectOverride = (props) => (
  <ReactSelect
    {...props}
    menuPortalTarget={document.querySelector('body')}
    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
  />
);

export { ReactSelectOverride };
