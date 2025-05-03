import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize state to undefined to indicate initial state before client mount
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check window existence before proceeding (extra safety)
    if (typeof window === 'undefined') {
       return;
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Function to update state based on media query
    const checkDevice = () => {
      setIsMobile(mql.matches); // Use mql.matches directly
    };

    // Initial check after component mounts
    checkDevice();

    // Add listener for changes
    mql.addEventListener("change", checkDevice);

    // Cleanup listener on component unmount
    return () => mql.removeEventListener("change", checkDevice);

  }, []); // Empty dependency array ensures this runs only once on mount

  // Return the state (will be undefined during SSR, then boolean on client)
  // Using !! converts undefined to false, ensuring a boolean return type for consumers
  // but only after the initial client-side check has run.
  // Consumers should handle the initial `undefined` state if necessary (e.g., by checking `isMobile === undefined`).
  // However, the RootLayout pattern now handles the SSR placeholder, so direct boolean conversion is safer here.
  return isMobile === undefined ? false : isMobile; // Default to false during SSR/initial undefined state
}

    