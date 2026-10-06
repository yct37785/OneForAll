import React from 'react';

export type ScreenNavigate = (routeName: string, params?: any) => void;
export type ScreenGoBack = () => void;

export type ScreenProps<P = any> = {
  navigate: ScreenNavigate;
  goBack: ScreenGoBack;
  routeName: string;
  param?: P;  // optional route params
};

export type ScreenType<P = any> = React.FC<ScreenProps<P>>;
