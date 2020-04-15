import React from 'react';

import './PageContent.scss';

interface Props {
  children: React.ReactNode;
}

const PageContent = ({ children }: Props) => <div className="page-content">{children}</div>;

export default PageContent;
