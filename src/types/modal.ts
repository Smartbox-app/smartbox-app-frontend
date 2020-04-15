export interface Modal {
  isVisible: boolean;
  isClosable: boolean;
  isPrepared: boolean;
  isUnprepared: boolean;
  isFullscreen: boolean;
  content: React.ReactNode;
}
