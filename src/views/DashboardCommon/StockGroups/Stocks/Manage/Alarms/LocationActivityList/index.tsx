import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { FieldType, locationActivityList } from 'smartbox-tables';
import { LocationActivityListItem } from 'smartbox-types';
import { ConfirmModal, Table } from 'src/components/Common';
import { Spinner , Button } from 'src/components/Branded';
import { ButtonsContainer, Section } from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { useLocationActivityQuery } from 'src/queries';
import {
  useClearLocationActivityMutation,
  useToggleLocationActivityMutation,
} from 'src/mutations';
import { Header, Typography, Button as UIButton } from 'src/components/ui';

export const LocationActivityList = () => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();
  const { data: activities = [], isPending } =
    useLocationActivityQuery(stockId);
  const { mutate: toggleActivity, isPending: isTogglePending } =
    useToggleLocationActivityMutation(stockId!);
  const { mutate: clearActivities, isPending: isClearPending } =
    useClearLocationActivityMutation(stockId!);

  const scheme = useMemo(() => {
    return new InteractiveTableSchema(locationActivityList).addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      type: FieldType.Custom,
      customRender: (_v, _f, row: LocationActivityListItem) => (
        <Button
          text="application.toggleLocationActivity"
          small
          success
          disabled={isTogglePending}
          click={() =>
            dispatch(
              showModal(
                <ConfirmModal
                  mainText="application.confirmToggleLocationActivity"
                  approveButtonText="application.yes"
                  approveAction={() =>
                    toggleActivity(row.id, {
                      onSuccess: () => {
                        dispatch(
                          successNotification(
                            'application.locationActivityToggledSuccessfully',
                          ),
                        );
                      },
                    })
                  }
                />,
              ),
            )
          }
        />
      ),
    });
  }, [dispatch, isTogglePending, toggleActivity]);

  const tableData = useMemo(
    () => ({
      countTotal: activities.length,
      items: activities,
    }),
    [activities],
  );

  const handleClearAll = () => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText="application.confirmClearLocationActivity"
          approveButtonText="application.yes"
          approveAction={() =>
            clearActivities(undefined, {
              onSuccess: (result) => {
                dispatch(
                  successNotification(
                    __('application.locationActivityClearedSuccessfully', {
                      count: result?.deletedCount ?? 0,
                    }),
                  ),
                );
              },
            })
          }
        />,
      ),
    );
  };

  const isLoading = isPending || isTogglePending || isClearPending;

  return (
    <Section>
      {isLoading ? <Spinner halfTransparent overlay /> : null}
      <ButtonsContainer spaceBetween>
        <div>
          <Header variant="h2">{__('application.locationActivityList')}</Header>
          <Typography>
            {__('application.locationActivityListDescription')}
          </Typography>
          <div>
            <Typography>
              <strong>{__('application.locationActivityAlarmInfo')}</strong>
            </Typography>
          </div>
        </div>
        <UIButton
          variant="error"
          type="button"
          text="application.clearLocationActivity"
          disabled={!activities.length || isClearPending}
          onClick={handleClearAll}
        />
      </ButtonsContainer>
      <Table scheme={scheme} data={tableData} />
    </Section>
  );
};
