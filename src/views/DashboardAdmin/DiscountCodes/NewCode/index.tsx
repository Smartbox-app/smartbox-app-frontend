import React from 'react';
import { SectionHeader } from '../../../../components/Layout';

import './NewCode.scss';

interface Props {
  newCode: string;
}

const NewCode = ({ newCode }: Props) => (
  <div className="new-code-wrapper">
    <SectionHeader title="Wygenerowano kod" />
    <p>
      Kod: <strong>{newCode}</strong>
    </p>
    <p>
      Zniżka: <strong>{10}%</strong>
    </p>
    <p>
      Na czas: <strong>{10} tygodni</strong>
    </p>
  </div>
);

export default NewCode;
