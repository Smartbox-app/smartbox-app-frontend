import { Alert } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, Header, Section, Stack } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { useOrderPaths } from 'src/views/DashboardCommon/Order/useOrderPaths';

export const OrderLoadError = () => {
  const { goToStockSelect } = useOrderPaths();
  const { getText } = useTenantNaming();

  return (
    <Stack>
      <Section>
        <Header variant="h2">{__('application.orderSelectionErrorTitle')}</Header>
        <Alert type="error">{getText('not_found')}</Alert>
        <ButtonsContainer>
          <Button
            type="button"
            size="large"
            rawText={getText('back_to_select')}
            onClick={() => goToStockSelect()}
          />
        </ButtonsContainer>
      </Section>
    </Stack>
  );
};
