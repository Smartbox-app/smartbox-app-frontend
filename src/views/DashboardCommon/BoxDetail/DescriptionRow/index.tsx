import React from 'react';
import { __ } from '../../../../helpers/i18n';
import styled from 'styled-components';
import { colorOrDark } from '../../../../utils/color';

interface Props {
  children: React.ReactNode;
  text: string;
  icon: string;
}

const StyledIcon = styled.span`
  color: ${props => colorOrDark(props.theme.colors.primary)}
`

const DescriptionRow = ({ children, text, icon }: Props) => {
  return (
    <p className="single">
      <StyledIcon className={`fa ${icon}`} />
      <div>
        <span>{__(text)}: </span>
        <strong>{children}</strong>
      </div>
    </p>
  );
};

export default DescriptionRow;
