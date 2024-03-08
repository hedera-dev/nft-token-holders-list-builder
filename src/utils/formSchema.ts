import { z } from 'zod';
import dictionary from '@/dictionary/en.json';

export const formSchema = (isFungible: boolean, maxDecimalPlaces: number) =>
  z.object({
    tokenId: z.string().refine((value) => /^0\.0\.\d*$/.test(value), {
      message: dictionary.tokenIdFormatError,
    }),
    minAmount: z.string().refine(
      (value) => {
        if (isNaN(Number(value)) || value === '' || value === null) {
          return false;
        }
        if (!isFungible) {
          return true;
        }
        const regex = new RegExp(`^-?\\d*(\\.\\d{0,${maxDecimalPlaces}})?$`);
        return regex.test(value) && Number(value) >= 0;
      },
      {
        message: isFungible ? `${dictionary.fungibleMinAmountFormatError} ${maxDecimalPlaces}` : dictionary.nonFungibleMinAmountFormatError,
      },
    ),
  });
