import React from 'react';
import { GetGiftRes } from 'smartbox-types';
import { SectionHeader } from '../../../../components/Layout';

import './NewCode.scss';

interface Props {
  newCodeProps: GetGiftRes;
}

const NewCode = ({ newCodeProps }: Props) => (
  <div className="new-code-wrapper">
    <SectionHeader title="Wygenerowano kod" />
    <p>
      Kod: <strong>{newCodeProps.code}</strong>
    </p>
    <p>
      Zniżka: <strong>{newCodeProps.discount}%</strong>
    </p>
    <p>
      Na czas: <strong>{newCodeProps.duration} tygodni</strong>
    </p>
  </div>
);

export default NewCode;
