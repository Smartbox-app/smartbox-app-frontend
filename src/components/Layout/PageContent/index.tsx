import React from 'react';

import './PageContent.scss';

interface Props {
  children: React.ReactNode;
  bg?: boolean;
}

const PageContent = ({ children, bg }: Props) => <div className={`page-content ${bg ? 'bg' : ''}`}>{children}</div>;

export default PageContent;
