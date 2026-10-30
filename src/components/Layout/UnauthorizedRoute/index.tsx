import React, { ReactNode } from 'react';

import Footer from '../Footer';

type UnauthorizedRouteProps = {
  children: ReactNode;
};

/** Catch-all Switch child for guest/public pages: matched route plus site footer. */
export const UnauthorizedRoute = ({ children }: UnauthorizedRouteProps) => (
  <>
    {children}
    <Footer />
  </>
);
