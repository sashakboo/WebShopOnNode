import { useState } from 'react';

export const useNotify = () => {
  const [basketCount, setbasketCount] = useState(0);
  const changeBasketCount = (count: number) => {
    setbasketCount(basketCount + count);
  }

  const resetBasketCount = () => {
    setbasketCount(0);
  }

  return { basketCount, changeBasketCount, resetBasketCount };
}