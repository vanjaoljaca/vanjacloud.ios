import * as React from 'react';

import { VanjacloudIosNativeViewProps } from './VanjacloudIosNative.types';

export default function VanjacloudIosNativeView(props: VanjacloudIosNativeViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
