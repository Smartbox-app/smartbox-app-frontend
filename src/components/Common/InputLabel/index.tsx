import React from 'react';
import { __ } from '../../../helpers/i18n';
import './InputLabel.scss';

interface Props {
    name: string;
    label?: string;
    big?: boolean;
}

const InputLabel = ({ label, name, big }: Props) => {
    if (!label) return null;

    return <label className={`input-label ${big ? 'big' : 'compact'}`} htmlFor={name}>{__(label)} </label>;
}

export { InputLabel }