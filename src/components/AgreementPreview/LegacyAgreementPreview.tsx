import { Capacitor } from '@capacitor/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Spinner } from 'src/components/Branded';
import { Alert } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { Button } from 'src/components/ui';
import { SearchZoomIn } from 'src/icons';
import ApiService from 'src/services/api-service';
import type { AgreementTemplateInput } from 'src/utils/agreement-template-query';
import {
  buildLegacyAgreementPath,
  buildLegacyAgreementUrl,
} from 'src/utils/agreement-template-query';
import { handleFileOpen } from 'src/utils/handle-file-open';

const AgreementWrapper = styled.div`
  position: relative;
  min-height: 50vh;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

type Props = {
  tenantId: string;
  agreementFile?: string;
  template: AgreementTemplateInput;
};

export const LegacyAgreementPreview = ({
  tenantId,
  agreementFile,
  template,
}: Props) => {
  const [agreementLoaded, setAgreementLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const agreementType = useMemo(() => {
    if (!agreementFile) return null;
    if (agreementFile.includes('.docx')) return 'docx';
    return 'pdf';
  }, [agreementFile]);

  const legacyAgreementPath = useMemo(
    () => buildLegacyAgreementPath(tenantId, template),
    [tenantId, template],
  );

  const legacyAgreementUrl = useMemo(
    () => buildLegacyAgreementUrl(tenantId, template, ApiService.url),
    [tenantId, template],
  );

  const encodedLegacyUrl = encodeURIComponent(legacyAgreementUrl);

  const openAgreement = async () => {
    if (Capacitor.isNativePlatform()) {
      setIsDownloading(true);

      try {
        await handleFileOpen(legacyAgreementPath, agreementFile);
      } finally {
        setIsDownloading(false);
      }

      return;
    }

    window.open(legacyAgreementUrl, '_blank', 'noopener,noreferrer');
  };

  const checkFrame = () => {
    if (!frameRef.current) return false;

    const iframeDoc =
      frameRef.current.contentDocument ||
      frameRef.current.contentWindow?.document;

    if (!iframeDoc?.body.children.length) {
      frameRef.current.src += '';
      frameRef.current.contentWindow?.location.reload();

      setTimeout(() => {
        checkFrame();
      }, 6000);
      return false;
    }

    setAgreementLoaded(true);
    return true;
  };

  useEffect(() => {
    if (!frameRef.current || agreementType !== 'docx') return;

    if (!frameRef.current.contentDocument?.body.children.length) {
      checkFrame();
    }
  }, [agreementType]);

  if (!agreementFile) {
    return <Alert type="error" text="application.agreementPreviewError" />;
  }

  return (
    <>
      <AgreementWrapper>
        {!agreementLoaded && agreementType === 'docx' ? (
          <SpinnerWrapper>
            <Spinner overlay halfTransparent />
          </SpinnerWrapper>
        ) : null}
        {agreementType === 'docx' ? (
          <iframe
            ref={frameRef}
            src={`https://docs.google.com/gview?embedded=true&url=${encodedLegacyUrl}`}
            style={{ height: '50vh', width: '100%', border: 0 }}
            title="legacy-agreement-preview"
          />
        ) : null}
        {!Capacitor.isNativePlatform() && agreementType === 'pdf' ? (
          <object
            className="rules-embed"
            data={`${legacyAgreementUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            type="application/pdf"
            aria-label="Agreement preview"
          />
        ) : null}
      </AgreementWrapper>
      <ButtonsContainer center>
        <Button
          size="large"
          type="button"
          text="application.click_to_open"
          iconLeft={<SearchZoomIn />}
          disabled={isDownloading}
          onClick={() => void openAgreement()}
        />
      </ButtonsContainer>
    </>
  );
};
