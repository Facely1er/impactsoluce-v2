/**
 * Image optimization utilities
 */

// Default image sizes for responsive images
export const DEFAULT_IMAGE_SIZES = [320, 640, 768, 1024, 1280, 1536, 1920];

// Default image formats
export const DEFAULT_IMAGE_FORMATS = ['webp', 'jpg'];

// Function to generate srcset for responsive images
export const generateSrcSet = (
  baseUrl: string,
  sizes = DEFAULT_IMAGE_SIZES,
  formats = DEFAULT_IMAGE_FORMATS
): Record<string, string> => {
  const result: Record<string, string> = {};
  
  formats.forEach(format => {
    result[format] = sizes
      .map(size => {
        // For Pexels images
        if (baseUrl.includes('pexels.com')) {
          // Extract the base URL without any existing size parameters
          const baseUrlWithoutSize = baseUrl.replace(/\?.*$/, '');
          return `${baseUrlWithoutSize}?auto=compress&cs=tinysrgb&w=${size} ${size}w`;
        }
        
        // For other image services, you can add similar logic
        
        // Default case - just append width parameter
        return `${baseUrl}?w=${size} ${size}w`;
      })
      .join(', ');
  });
  
  return result;
};

// Function to get appropriate size based on viewport
export const getResponsiveImageUrl = (
  baseUrl: string,
  viewportWidth: number
): string => {
  // Find the appropriate size based on viewport width
  const size = DEFAULT_IMAGE_SIZES.find(size => size >= viewportWidth) || DEFAULT_IMAGE_SIZES[DEFAULT_IMAGE_SIZES.length - 1];
  
  // For Pexels images
  if (baseUrl.includes('pexels.com')) {
    const baseUrlWithoutSize = baseUrl.replace(/\?.*$/, '');
    return `${baseUrlWithoutSize}?auto=compress&cs=tinysrgb&w=${size}`;
  }
  
  // Default case
  return `${baseUrl}?w=${size}`;
};

// Function to check if browser supports WebP
export const supportsWebP = (): boolean => {
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

// Function to get the best supported image format
export const getBestImageFormat = (): string => {
  return supportsWebP() ? 'webp' : 'jpg';
};

// Function to create a responsive image component props
export const getResponsiveImageProps = (
  src: string,
  alt: string,
  sizes = '100vw',
  lazy = true
): React.ImgHTMLAttributes<HTMLImageElement> => {
  const srcSet = generateSrcSet(src);
  const bestFormat = getBestImageFormat();
  
  return {
    src,
    alt,
    srcSet: srcSet[bestFormat],
    sizes,
    loading: lazy ? 'lazy' : undefined,
    decoding: 'async',
  };
};