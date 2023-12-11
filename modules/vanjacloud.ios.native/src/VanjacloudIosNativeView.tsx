import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { VanjacloudIosNativeViewProps } from './VanjacloudIosNative.types';

const NativeView: React.ComponentType<VanjacloudIosNativeViewProps> =
  requireNativeViewManager('VanjacloudIosNative');

export default function VanjacloudIosNativeView(props: VanjacloudIosNativeViewProps) {
  return <NativeView {...props} />;
}
