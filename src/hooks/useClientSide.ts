import { useEffect, useState } from 'react';

export const useClientSide = () => {
  const [clientSide, setClientSide] = useState(false);

  useEffect(() => {
    setClientSide(true);

    return () => {
      setClientSide(false);
    };
  }, []);

  return { clientSide };
};
