import { z } from 'zod';
import dictionary from '@/dictionary/en.json';

export const formSchema = z.object({
  tokenId: z.string().refine((value) => /^0\.0\.\d*$/.test(value), {
    message: dictionary.tokenIdFormatError,
  }),
  minAmount: z.string().refine(
    (value) => {
      if (isNaN(Number(value)) || value === '' || value === null) {
        return false;
      }
      return Number(value) >= 0;
    },
    {
      message: dictionary.minAmountFormatError,
    },
  ),
});
