import React, { Component } from 'react';

import ApplicationError from '../../../views/ApplicationError';

interface State {
  hasError: boolean;
}
interface Props {
  children: React.ReactNode;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
    console.error('ERROR', error);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    if (hasError) {
      return <ApplicationError />;
    }
    return <>{children}</>;
  }
}

export default ErrorBoundary;
