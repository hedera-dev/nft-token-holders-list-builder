import { z } from 'zod';
import dictionary from '@/dictionary/en.json';
import { TokenDetails } from '@/types/tokenDetails-response';

const getCommonValues = (ctx: any, tokenDetails: TokenDetails[]) => {
  const index = Number(ctx.path[ctx.path.length - 2]);
  const maxDecimalPlaces = Number(tokenDetails[index]?.decimals);
  const isFungible = tokenDetails[index].type === 'FUNGIBLE_COMMON';
  return { maxDecimalPlaces, isFungible };
};

const DurationTypeSchema = z.union([z.literal('days'), z.literal('weeks'), z.literal('months')]);

export const formSchema = (tokenDetails: TokenDetails[]) =>
  z.object({
    formData: z.array(
      z.object({
        tokenId: z.string().refine((value) => /^0\.0\.\d*$/.test(value), {
          message: dictionary.tokenIdFormatError,
        }),
        minAmount: z.string().superRefine((value, ctx) => {
          const { maxDecimalPlaces, isFungible } = getCommonValues(ctx, tokenDetails);

          if (isNaN(Number(value)) || value === '' || value === null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: dictionary.minAmountRequired,
            });
            return false;
          }

          if (isFungible) {
            return true;
          }

          const regex = maxDecimalPlaces === 0 ? new RegExp(`^-?\\d*$`) : new RegExp(`^-?\\d*(\\.\\d{0,${maxDecimalPlaces}})?$`);
          const isValid = regex.test(value) && Number(value) >= 0;
          if (!isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${dictionary.nonFungibleMinAmountFormatError} ${maxDecimalPlaces}`,
            });
          }
          return isValid;
        }),
        tokenName: z.string(),
        isNFT: z.boolean(),
        isDurationSelect: z.boolean(),
        isCollapsed: z.boolean(),
        durationType: DurationTypeSchema,
        duration: z.union([z.string(), z.date(), z.undefined()]).refine(
          (value) => {
            if (value === undefined || value === '') {
              return true;
            }
            if (value instanceof Date) {
              return true;
            }
            return true && !isNaN(Number(value)) && Number(value) > 0;
          },
          {
            message: 'Invalid duration value',
          },
        ),
      }),
    ),
  });
