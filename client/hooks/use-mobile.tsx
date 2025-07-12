import * as React from "react";

c 

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      se removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
