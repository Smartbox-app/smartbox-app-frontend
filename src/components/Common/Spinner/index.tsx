import * as React from 'react';
import './Spinner.scss';

interface Props {
  overlay?: boolean;
  small?: boolean;
  transparent?: boolean;
  halfTransparent?: boolean;
  dark?: boolean;
  fading?: boolean;
}

const Spinner = ({ overlay, transparent, halfTransparent, dark, small, fading }: Props) => (
  <div
    className={`spinner-container ${overlay ? 'overlay' : ''}
    ${small ? 'small' : ''} ${transparent ? 'transparent' : ''} 
    ${halfTransparent ? 'half-transparent' : ''} 
    ${dark ? 'dark' : ''}
    ${fading ? 'fading' : ''}
    `}
  >
    <div className="spinner" />
  </div>
);

export default Spinner;
