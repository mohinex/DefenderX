import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Find element by hash ID (removing the leading '#')
      const elementId = hash.replace('#', '');
      
      // Delay slightly to allow React to mount the component on route transit
      const timer = setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          const navbarHeight = 64;
          const buffer = 20; // 20px extra spacing for an elegant, spacious feel
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - (navbarHeight + buffer);

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    } else {
      // No hash: scroll directly to the top instantly
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior
      });
    }
  }, [pathname, hash]);

  return null;
}
