import React from 'react';
import { TranslatableObject } from '../../../utils/errors-trans';
import { InputError } from '../InputError';

interface Props {
    errors: TranslatableObject[];
    big?: boolean;
}

const InputErrors = ({ errors, big }: Props) => {
    return <>
        {errors.map((error, index) => <InputError key={index} big={big} error={error.messageCompiled} />)}
    </>
}

export { InputErrors }