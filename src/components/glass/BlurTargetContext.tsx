import { createContext, useContext, RefObject } from 'react';
import { View } from 'react-native';

/**
 * Android's real blur methods (dimezisBlurView / dimezisBlurViewSdk31Plus) need an
 * explicit ref to the content they should blur — unlike iOS, which blurs whatever
 * is behind a BlurView automatically. LiquidBackground publishes a ref to its own
 * rendered background here; every GlassSurface underneath it picks it up
 * automatically so screens don't need to wire refs through every glass panel by hand.
 */
const BlurTargetContext = createContext<RefObject<View | null> | null>(null);

export function useBlurTarget() {
  return useContext(BlurTargetContext);
}

export default BlurTargetContext;
