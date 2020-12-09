import React, { Component } from 'react';
import ApplicationError from '../../../views/ApplicationError';

interface State {
  hasError: boolean;
}
interface Props {
  children: React.ReactNode;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('error', error);
    console.log('errorInfo', errorInfo);
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
