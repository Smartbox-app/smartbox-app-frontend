import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import {
  BoxListRes,
  BoxMapRes,
  RentDetailsRes,
  RentStatus,
  UserRes,
} from 'smartbox-types';
import { connect, useDispatch } from 'react-redux';
import { boxes } from '../../../actions';
import { PageHeader } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { dateOnly } from '../../../utils/format-date';
import { __ } from '../../../helpers/i18n';

import DescriptionRow from './DescriptionRow';
import { Edit } from './Edit';

import './BoxDetail.scss';
import { useGetMyDetailsQuery } from '../../../queries';
import { Header, Link } from 'src/components/ui';

interface Props {
  singleBoxDetail: RentDetailsRes;
  box: BoxListRes | BoxMapRes;
  stockId: string;
  boxDataCleanUp: () => void;
  callback?: () => void;
}

const BoxDetail = ({
  boxDataCleanUp,
  box: { rentId, id, identifier, status },
  singleBoxDetail,
  stockId,
  callback,
}: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();

  useEffect(() => {
    if (rentId) dispatch(boxes.fetchSingleBoxDetails(rentId));

    return () => {
      boxDataCleanUp();
    };
  }, []);

  if (!user) return null;

  const isThisBoxFree = (data: string): boolean => data === '';

  return (
    <div className="detail-wrapper">
      <Header variant="h2">{__('application.singleStoreDetail')}</Header>

      <DescriptionRow icon="fa-lock" text="application.storeNumber">
        {identifier}
      </DescriptionRow>

      {rentId && status !== RentStatus.free && (
        <>
          <DescriptionRow icon="fa-user" text="application.rentedBy">
            {singleBoxDetail.owner
              ? `${singleBoxDetail.owner.firstName} ${singleBoxDetail.owner.lastName}`
              : '---'}
          </DescriptionRow>

          <DescriptionRow icon="fa-calendar" text="application.startDate">
            {dateOnly(singleBoxDetail.startAt)}
          </DescriptionRow>

          <DescriptionRow icon="fa-calendar" text="application.endDate">
            {dateOnly(singleBoxDetail.finishAt)}
          </DescriptionRow>

          <DescriptionRow icon="fa-mobile" text="application.phone">
            {singleBoxDetail?.owner?.phone ? (
              <Link href={`tel:${singleBoxDetail.owner.phone}`}>
                {singleBoxDetail.owner.phone}
              </Link>
            ) : (
              '---'
            )}
          </DescriptionRow>

          <DescriptionRow icon="fa-envelope" text="application.mail">
            {isThisBoxFree(rentId) ? (
              '---'
            ) : (
              <a
                href={`mailto:${singleBoxDetail.owner?.email ? singleBoxDetail.owner?.email : 'error'}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {singleBoxDetail.owner
                  ? singleBoxDetail.owner.email
                  : __('application.lack')}
              </a>
            )}
          </DescriptionRow>
        </>
      )}

      <DescriptionRow icon="fa-arrow-right" text="application.storeState">
        {`${singleBoxDetail.status}`}
      </DescriptionRow>

      <Edit
        display
        callback={callback}
        selectedBoxId={id}
        rentId={rentId}
        singleBoxDetailStatus={singleBoxDetail.status}
        stockId={stockId}
      />
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleBoxDetail: state.boxes.singleBoxDetail,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ ...boxes }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BoxDetail);
