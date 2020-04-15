// homepage view - example

import React from 'react';
import { Main } from '../../components/Layout';
import { __ } from '../../helpers/i18n';

const Home = () => (
  <Main>
    <h1>{__('application.welcome')}</h1>
  </Main>
);

export default Home;
