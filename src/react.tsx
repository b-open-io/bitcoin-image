import React from "react";
import { useEffect, useRef, useState } from "react";
import { ImageProtocols } from "./index";
import type { DisplayOptions, ParsedImageURL } from "./index";

// Create a singleton instance for React apps
let sharedInstance: ImageProtocols | null = null;

function getSharedInstance(): ImageProtocols {
  if (!sharedInstance) {
    sharedInstance = new ImageProtocols({
      cacheEnabled: true,
      cacheTTL: 3600,
    });
  }
  return sharedInstance;
}

/**
 * React hook for loading blockchain images
 */
export function useBlockchainImage(
  url: string | null | undefined,
  options?: DisplayOptions & { instance?: ImageProtocols },
) {
  const [state, setState] = useState<{
    displayUrl: string;
    loading: boolean;
    error: Error | null;
    parsed: ParsedImageURL | null;
  }>({
    displayUrl: "",
    loading: true,
    error: null,
    parsed: null,
  });

  const imageProtocols = options?.instance || getSharedInstance();

  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      if (!url) {
        setState({
          displayUrl: options?.fallback || "",
          loading: false,
          error: null,
          parsed: null,
        });
        return;
      }

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const parsed = imageProtocols.parse(url);
        const displayUrl = await imageProtocols.getDisplayUrl(url, options);

        if (!cancelled) {
          setState({
            displayUrl,
            loading: false,
            error: null,
            parsed,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            displayUrl: options?.fallback || "",
            loading: false,
            error: error instanceof Error ? error : new Error("Failed to load image"),
            parsed: null,
          });
        }
      }
    }

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [url, options?.fallback]);

  return state;
}

/**
 * React hook for batch loading images
 */
export function useBlockchainImages(
  urls: string[],
  options?: DisplayOptions & { instance?: ImageProtocols },
) {
  const [state, setState] = useState<{
    images: Map<string, string>;
    loading: boolean;
    error: Error | null;
  }>({
    images: new Map(),
    loading: true,
    error: null,
  });

  const imageProtocols = options?.instance || getSharedInstance();

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const images = await imageProtocols.getDisplayUrls(urls, options);

        if (!cancelled) {
          setState({
            images,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            images: new Map(),
            loading: false,
            error: error instanceof Error ? error : new Error("Failed to load images"),
          });
        }
      }
    }

    if (urls.length > 0) {
      loadImages();
    } else {
      setState({
        images: new Map(),
        loading: false,
        error: null,
      });
    }

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(urls), options?.fallback]);

  return state;
}

/**
 * React hook for lazy loading images with intersection observer
 */
export function useLazyBlockchainImage(
  url: string | null | undefined,
  options?: DisplayOptions & {
    instance?: ImageProtocols;
    rootMargin?: string;
    threshold?: number | number[];
  },
) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: options?.rootMargin || "50px",
        threshold: options?.threshold || 0,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options?.rootMargin, options?.threshold]);

  const imageState = useBlockchainImage(isInView ? url : null, options);

  return {
    ...imageState,
    ref,
    isInView,
  };
}

// Export types for React components
export interface BlockchainImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "onError"> {
  src: string;
  fallback?: string;
  instance?: ImageProtocols;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (error: Error) => void;
  lazy?: boolean;
  placeholder?: string;
}

/**
 * React component for displaying blockchain images
 */
export function BlockchainImage({
  src,
  fallback,
  instance,
  onLoadingChange,
  onError,
  lazy = false,
  placeholder,
  ...imgProps
}: BlockchainImageProps) {
  const lazyResult = useLazyBlockchainImage(lazy ? src : null, { fallback, instance });
  const normalResult = useBlockchainImage(lazy ? null : src, { fallback, instance });

  const displayUrl = lazy ? lazyResult.displayUrl : normalResult.displayUrl;
  const loading = lazy ? lazyResult.loading : normalResult.loading;
  const error = lazy ? lazyResult.error : normalResult.error;
  const ref = lazy ? lazyResult.ref : undefined;

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  return (
    <img
      {...imgProps}
      ref={ref}
      src={loading && placeholder ? placeholder : displayUrl}
      alt={imgProps.alt || "Blockchain image"}
      onError={(e) => {
        if (fallback && e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback;
        }
      }}
    />
  );
}
