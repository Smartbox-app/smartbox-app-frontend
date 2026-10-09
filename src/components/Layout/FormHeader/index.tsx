import React from 'react';

import './FormHeader.scss';
import {__} from "../../../helpers/i18n";
import { Header } from 'src/components/ui';

interface Props {
  title: string;
  noMargin?: boolean;
}

const FormHeader = ({ title }: Props) => (
  <Header variant='h2'>{__(title)}</Header>
);

export default FormHeader;
