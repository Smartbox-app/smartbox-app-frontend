import * as React from 'react';
import './Spinner.scss';

interface Props {
  overlay?: boolean;
  small?: boolean;
  big?: boolean;
  transparent?: boolean;
  halfTransparent?: boolean;
  dark?: boolean;
  fading?: boolean;
}

const Spinner = ({ overlay, transparent, halfTransparent, dark, small, fading, big }: Props) => (
  <div
    className={`spinner-container ${overlay ? 'overlay' : ''}
    ${small ? 'small' : ''} ${transparent ? 'transparent' : ''} 
    ${halfTransparent ? 'half-transparent' : ''} 
    ${dark ? 'dark' : ''}
    ${big ? 'big' : ''}
    ${fading ? 'fading' : ''}
    `}
  >
    <div className="spinner" />
  </div>
);

export default Spinner;
