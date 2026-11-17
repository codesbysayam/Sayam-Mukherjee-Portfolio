import { createContext, useContext, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import {
  usePrefersReducedMotion,
  useDeviceCapability,
  useFinePointer,
  type DeviceCapabilityTier,
} from "./tokens";

interface MotionContextValue {
  reducedMotion: boolean;
  capability: DeviceCapabilityTier;
  isFinePointer: boolean;
}

const MotionSettingsContext = createContext<MotionContextValue>({
  reducedMotion: false,
  capability: "standard",
  isFinePointer: false,
});

export function MotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const capability = useDeviceCapability();
  const isFinePointer = useFinePointer();

  return (
    <MotionConfig reducedMotion="user">
      <MotionSettingsContext.Provider
        value={{ reducedMotion, capability, isFinePointer }}
      >
        {children}
      </MotionSettingsContext.Provider>
    </MotionConfig>
  );
}

export function useMotionSettings(): MotionContextValue {
  return useContext(MotionSettingsContext);
}
