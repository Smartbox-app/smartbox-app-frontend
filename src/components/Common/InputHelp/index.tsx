import React from 'react';
import { __ } from '../../../helpers/i18n';
import './InputHelp.scss';

interface Props {
    text: string;
    big?: boolean;
}

const InputHelp = ({ text, big }: Props) => {
    if (!text) return null;

    return <p className={`${big ? 'big' : ''} input-help`}><span className='fa fa-info-circle' /> {__(text)} </p>;
}

export { InputHelp }