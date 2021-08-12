import React from 'react';
import { GiftRes } from 'smartbox-types';
import { SectionHeader } from '../../../../../components/Layout';
import { __ } from '../../../../../helpers/i18n';

import './NewCode.scss';

interface Props {
  newCodeProps: GiftRes;
}

const NewCode = ({ newCodeProps }: Props) => (
  <div className="new-code-wrapper">
    <SectionHeader title={__('application.giftCodeGenerated')} />
    <p>
      {__('application.giftCod')}: <strong>{newCodeProps.code}</strong>
    </p>
    <p>
      {__('application.giftCodDiscount')}: <strong>{newCodeProps.discount}%</strong>
    </p>
    <p>
      {__('application.forTime')}:{' '}
      <strong>
        {newCodeProps.duration} {__('application.weeksAmount')}
      </strong>
    </p>
  </div>
);

export default NewCode;
