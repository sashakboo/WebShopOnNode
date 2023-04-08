import { useState, useCallback, useEffect } from 'react';

export const useNotify = () => {
  const [basketCount, setbasketCount] = useState(0);
  const changeBasketCount = (count: number) => {
    setbasketCount(basketCount + count);
  }

  return { basketCount, changeBasketCount };
}