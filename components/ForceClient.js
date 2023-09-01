import { useState, useEffect } from "react";

const ForceClient = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient ? children : null;
};

export default ForceClient;
