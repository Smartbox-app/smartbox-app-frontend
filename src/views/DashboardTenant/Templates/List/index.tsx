import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Spinner } from 'src/components/Branded';
import { ConfirmModal } from 'src/components/Common';
import { Header, Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useDeleteTemplateMutation } from 'src/mutations';
import { ChannelTemplates } from './ChannelTemplates';
import { LanguageSummary, SectionSummary } from './SectionSummary';
import { useTemplateSections } from './useTemplateSections';

const Container = styled('div')({
  maxWidth: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

const Languages = styled('div')(({ theme }) => ({
  marginTop: theme.spacing * 2,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
}));

type ListProps = {
  basePath: string;
  tenantId?: string;
};

export const List = ({ basePath, tenantId }: ListProps) => {
  const dispatch = useDispatch();
  const { sections, isPending } = useTemplateSections(tenantId);
  const { mutate: deleteTemplate } = useDeleteTemplateMutation();

  const handleResetSuccess = () => {
    dispatch(successNotification('application.templateReset'));
  };

  const handleDeleteSuccess = () => {
    dispatch(successNotification('application.templateDeleted'));
  };

  const handleDelete = (id: string, reset = false) => {
    deleteTemplate(
      { id, tenantId },
      { onSuccess: reset ? handleResetSuccess : handleDeleteSuccess },
    );
  };

  const confirmDelete = (id: string, reset = false) => {
    dispatch(
      showModal(
        <ConfirmModal
          mainText={
            reset
              ? 'application.confirmTemplateReset'
              : 'application.confirmTemplateDelete'
          }
          approveButtonText={
            reset ? 'application.resetTemplate' : 'application.delete'
          }
          approveAction={() => handleDelete(id, reset)}
        />,
      ),
    );
  };

  return (
    <Section>
      <Container>
        <Header variant="h2">{__('application.templatesList')}</Header>
        <Typography>{__('application.clickToExpandTemplate')}</Typography>
        {isPending && <Spinner overlay />}
        {sections.map((section) => (
          <Section variant="bordered" key={section.label}>
            <details>
              <SectionSummary section={section} />
              <Languages>
                {section.languages.map((language) => (
                  <Section variant="bordered" key={language.lang}>
                    <details data-template-lang={language.lang}>
                      <LanguageSummary language={language} />
                      <ChannelTemplates
                        basePath={basePath}
                        channel="email"
                        groups={language.email}
                        onDelete={confirmDelete}
                      />
                      <ChannelTemplates
                        basePath={basePath}
                        channel="sms"
                        groups={language.sms}
                        onDelete={confirmDelete}
                      />
                    </details>
                  </Section>
                ))}
              </Languages>
            </details>
          </Section>
        ))}
      </Container>
    </Section>
  );
};
