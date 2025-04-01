'use client';

import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
  loadTime: number;
}

/**
 * Custom hook to track performance metrics like FPS and memory usage
 * @param enabled Whether to enable performance tracking
 * @returns Performance metrics object
 */
export function usePerformance(enabled = true): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: undefined,
    loadTime: 0,
  });

  // Calculate page load time
  useEffect(() => {
    if (!enabled) return;

    const loadTime =
      window.performance && window.performance.timing
        ? window.performance.timing.domContentLoadedEventEnd -
          window.performance.timing.navigationStart
        : 0;

    setMetrics((prev) => ({ ...prev, loadTime }));
  }, [enabled]);

  // Track FPS and memory usage
  useEffect(() => {
    if (!enabled) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const trackFPS = () => {
      frameCount++;
      const now = performance.now();

      // Update every second
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));

        // Get memory info if available (Chrome only)
        const memory = (performance as any).memory
          ? {
              jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            }
          : undefined;

        setMetrics((prev) => ({ ...prev, fps, memory }));

        frameCount = 0;
        lastTime = now;
      }

      rafId = requestAnimationFrame(trackFPS);
    };

    trackFPS();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  return metrics;
}

/**
 * Formats bytes to a human-readable string
 * @param bytes Number of bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
