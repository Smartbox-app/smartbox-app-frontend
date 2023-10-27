import React from 'react';
import { __ } from '../../../helpers/i18n';
import './InputError.scss';

interface Props {
    error: string;
    big?: boolean;
}

const InputError = ({ error, big }: Props) => {
    if (!error) return null;

    return <p className={`input-error ${big ? 'big' : 'compact'}`}><span className='fa fa-exclamation-circle' /> {error} </p>;
}

export { InputError }