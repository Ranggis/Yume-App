declare module 'react-native-video' {
  import * as React from 'react';
  import { ViewStyle } from 'react-native';

  export interface OnLoadData {
    duration: number;
    naturalSize: { width: number; height: number; orientation: string };
  }

  export interface OnProgressData {
    currentTime: number;
    playableDuration: number;
  }

  export interface VideoProperties {
    source: { uri: string };
    style?: ViewStyle;
    resizeMode?: 'cover' | 'contain' | 'stretch';
    paused?: boolean;
    onLoad?: (data: OnLoadData) => void;
    onProgress?: (data: OnProgressData) => void;
  }

  export default class Video extends React.Component<VideoProperties> {}
}
