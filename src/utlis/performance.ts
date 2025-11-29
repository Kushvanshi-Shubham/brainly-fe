// Performance monitoring utilities

/**
 * Measure and log component render time
 * Usage: const cleanup = measureRenderTime('ComponentName');
 * Call cleanup() when component unmounts
 */
export function measureRenderTime(componentName: string): () => void {
  if (import.meta.env.DEV) {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // Flag renders slower than 60fps
        console.warn(`⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
    };
  }
  
  return () => {}; // No-op in production
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(img: HTMLImageElement): () => void {
  if ('IntersectionObserver' in globalThis) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          const src = image.dataset.src;
          
          if (src) {
            image.src = src;
            delete image.dataset.src;
            observer.unobserve(image);
          }
        }
      });
    });
    
    observer.observe(img);
    
    return () => observer.disconnect();
  }
  
  // Fallback for browsers without Intersection Observer
  const src = img.dataset.src;
  if (src) {
    img.src = src;
  }
  
  return () => {};
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, as: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Get Web Vitals metrics (placeholder for future implementation)
 */
export async function reportWebVitals(): Promise<void> {
  if (import.meta.env.PROD) {
    // Web vitals can be added later with: npm install web-vitals
    console.log('Web Vitals monitoring ready');
  }
}

/**
 * Optimize animation performance with requestAnimationFrame
 */
export function optimizeAnimation(callback: () => void): number {
  return requestAnimationFrame(callback);
}

/**
 * Cancel optimized animation
 */
export function cancelAnimation(id: number): void {
  cancelAnimationFrame(id);
}
