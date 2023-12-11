import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to VanjacloudIosNative.web.ts
// and on native platforms to VanjacloudIosNative.ts
import VanjacloudIosNativeModule from './src/VanjacloudIosNativeModule';
import VanjacloudIosNativeView from './src/VanjacloudIosNativeView';
import { ChangeEventPayload, VanjacloudIosNativeViewProps } from './src/VanjacloudIosNative.types';

// Get the native constant value.
export const PI = VanjacloudIosNativeModule.PI;

export function hello(): string {
  return VanjacloudIosNativeModule.hello();
}

export async function setValueAsync(value: string) {
  return await VanjacloudIosNativeModule.setValueAsync(value);
}

const emitter = new EventEmitter(VanjacloudIosNativeModule ?? NativeModulesProxy.VanjacloudIosNative);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { VanjacloudIosNativeView, VanjacloudIosNativeViewProps, ChangeEventPayload };
