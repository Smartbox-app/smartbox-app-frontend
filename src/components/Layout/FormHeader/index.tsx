import React from 'react';

import { Header } from 'src/components/ui';
import {__} from "src/helpers/i18n";

import './FormHeader.scss';

interface Props {
  title: string;
  noMargin?: boolean;
}

const FormHeader = ({ title }: Props) => (
  <Header variant='h2'>{__(title)}</Header>
);

export default FormHeader;
