/*-
 *
 * Hedera Token Holders List
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { z } from 'zod';
import dictionary from '@/dictionary/en.json';
import { TokenDetails } from '@/types/tokenDetails-response';

const getCommonValues = (ctx: any, tokenDetailsList: TokenDetails[]) => {
  const index = Number(ctx.path[ctx.path.length - 2]);
  const maxDecimalPlaces = Number(tokenDetailsList[index]?.decimals);
  const isFungible = tokenDetailsList[index].type === 'FUNGIBLE_COMMON';
  return { maxDecimalPlaces, isFungible };
};

const DurationTypeSchema = z.union([z.literal('days'), z.literal('weeks'), z.literal('months')]);

export const formSchema = (tokenDetailsList: TokenDetails[]) =>
  z.object({
    formData: z.array(
      z.object({
        tokenId: z.string().refine((value) => /^\d\.\d\.\d*$/.test(value), {
          message: dictionary.tokenIdFormatError,
        }),
        minAmount: z.string().superRefine((value, ctx) => {
          const { maxDecimalPlaces, isFungible } = getCommonValues(ctx, tokenDetailsList);

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
