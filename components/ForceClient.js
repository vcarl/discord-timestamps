import { useState, useEffect } from "react";

const ForceClient = ({ children, fallback = null }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient ? children : fallback;
};

export default ForceClient;
