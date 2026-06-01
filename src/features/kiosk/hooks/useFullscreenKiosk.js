"use client";

import { useCallback, useEffect, useState } from "react";

function getIsFullscreen() {
  if (typeof document === "undefined") return false;
  return Boolean(document.fullscreenElement);
}

export function useFullscreenKiosk() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => setIsFullscreen(getIsFullscreen());
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const enterFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      /* unsupported or denied */
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (getIsFullscreen()) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    /** @deprecated use enterFullscreen */
    requestFullscreen: enterFullscreen,
    /** @deprecated use isFullscreen */
    active: isFullscreen,
  };
}
