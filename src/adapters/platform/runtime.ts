import { Capacitor } from '@capacitor/core';

/** Plataforma só no adapter — domínio não conhece Capacitor. */
export type AppRuntimeTarget = 'web' | 'native';

export function getRuntimeTarget(): AppRuntimeTarget {
  return Capacitor.isNativePlatform() ? 'native' : 'web';
}

/** Web → sidebar; Android/iOS → tabs inferiores. */
export function prefersSidebarNavigation(): boolean {
  return getRuntimeTarget() === 'web';
}
