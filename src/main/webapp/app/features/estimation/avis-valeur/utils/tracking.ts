import { OuvertureEvent } from '../../types';

export function detectDevice(): OuvertureEvent['user_agent'] {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|kindle/.test(ua)) return 'tablette';
  if (/mobile|android|iphone|ipod|webos|blackberry/.test(ua)) return 'mobile';
  return 'desktop';
}
