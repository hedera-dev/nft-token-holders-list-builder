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
import dictionary from '@/dictionary/en.json';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { formSchema } from '@/utils/formSchema';
import { useFieldArray, useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nodeUrl } from '@/utils/const';
import { toast } from 'sonner';
import { TokenDetails } from '@/types/tokenDetails-response';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isValidTokenId } from '@/utils/isValidTokenId';
import Arrow from '@/assets/arrow.svg';

type HoldersFormProps = {
  setFormData: (formData: FormData['formData']) => void;
  setData: (data: any) => void;
  setShouldFetch: (shouldFetch: boolean) => void;
  setTokenDetailsList: (tokenDetailsList: TokenDetails[]) => void;
  tokenDetailsList: TokenDetails[] | undefined;
  isBalancesFetching: boolean;
};

export type DurationType = 'days' | 'weeks' | 'months';

export type FormData = {
  formData: {
    tokenId: string;
    minAmount: string;
    tokenName: string;
    isNFT: boolean;
    isDurationSelect: boolean;
    durationType: DurationType;
    isCollapsed: boolean;
    duration?: string | Date;
  }[];
};

export const HoldersForm = ({
  setFormData,
  setData,
  setShouldFetch,
  isBalancesFetching,
  setTokenDetailsList,
  tokenDetailsList,
}: HoldersFormProps) => {
  const useZodForm = <TSchema extends z.ZodType>(
    props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
      schema: TSchema;
    },
  ) => {
    return useForm<TSchema['_input']>({
      ...props,
      resolver: zodResolver(props.schema, undefined, {
        raw: true,
      }),
    });
  };

  const methods = useZodForm({
    schema: formSchema(tokenDetailsList || []),
    defaultValues: {
      formData: [
        { tokenId: '', minAmount: '0', tokenName: '', isNFT: false, isDurationSelect: false, duration: '', isCollapsed: false, durationType: 'days' },
      ],
    },
  });

  const { control, handleSubmit, getValues } = methods;

  const { fields, append, remove, update } = useFieldArray({
    name: 'formData',
    control,
  });

  const fetchTokenData = async (url: string, index: number, formData: FormData['formData'][0]) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${dictionary.httpError} ${response.status}`);
      }

      const data: TokenDetails = await response.json();
      setTokenDetailsList(tokenDetailsList ? [...tokenDetailsList, data] : [data]);

      update(index, {
        tokenId: formData.tokenId,
        minAmount: formData.minAmount,
        tokenName: data.name,
        isNFT: data.type === 'NON_FUNGIBLE_UNIQUE',
        isDurationSelect: formData.isDurationSelect,
        duration: formData.duration,
        isCollapsed: formData.isCollapsed,
        durationType: formData.durationType,
      });
      return data;
    } catch (error) {
      toast.error((error as Error).toString());
      // If token is not found, set tokenName to error message
      update(index, {
        tokenId: formData.tokenId,
        minAmount: formData.minAmount,
        tokenName: dictionary.wrongTokenId,
        isNFT: formData.isNFT,
        isDurationSelect: formData.isDurationSelect,
        duration: formData.duration,
        isCollapsed: formData.isCollapsed,
        durationType: formData.durationType,
      });
    }
  };

  const onSubmit = (data: FormData) => {
    setFormData(data.formData);
    setData([]);
    setShouldFetch(true);
  };

  const handleTokenIdBlur = async (tokenId: string, index: number) => {
    if (tokenId && isValidTokenId(tokenId)) {
      const url = `${nodeUrl}/api/v1/tokens/${tokenId}`;
      try {
        await fetchTokenData(url, index, getValues().formData[index]);
      } catch (error) {
        toast.error((error as Error).toString());
      }
    }
  };

  const handleTokenIdChange = (tokenId: string, index: number) => {
    if (!tokenId && !isValidTokenId(tokenId)) {
      const formData = getValues().formData[index];
      update(index, {
        tokenId: formData.tokenId,
        minAmount: formData.minAmount,
        tokenName: '',
        isNFT: formData.isNFT,
        isDurationSelect: formData.isDurationSelect,
        duration: formData.duration,
        isCollapsed: formData.isCollapsed,
        durationType: formData.durationType,
      });
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex items-start justify-center gap-2">
              <div className="w-full sm:w-1/3">
                <FormField
                  control={control}
                  name={`formData.${index}.tokenId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.tokenId}</FormLabel>
                      <FormControl>
                        <>
                          <Input
                            {...field}
                            placeholder={dictionary.exampleTokenId}
                            onChange={(event) => {
                              field.onChange(event);
                              handleTokenIdChange(event.target.value, index);
                            }}
                            onBlur={(event) => {
                              field.onBlur();
                              void handleTokenIdBlur(event.target.value, index);
                            }}
                          />
                          {fields[index].tokenName && <p className="text-sm text-muted-foreground">{fields[index].tokenName}</p>}
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full max-w-[80px] sm:w-1/3 sm:max-w-full">
                <FormField
                  control={control}
                  name={`formData.${index}.minAmount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.minAmount}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder={dictionary.minAmount} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="mt-8" disabled={fields.length === 1} type="button" onClick={() => remove(index)}>
                {dictionary.delete}
              </Button>
            </div>

            {fields[index].isNFT && (
              <div className="flex items-center justify-center">
                <div className="w-full rounded-t-lg bg-white sm:w-[80%] ">
                  <h2 className="mb-0">
                    <button
                      className="group relative flex w-full items-center rounded-t-lg border-0 bg-white px-5 py-4 text-left text-sm text-neutral-800 shadow-border-b transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none"
                      type="button"
                      onClick={() => {
                        const formData = getValues().formData[index];
                        update(index, {
                          tokenId: formData.tokenId,
                          minAmount: formData.minAmount,
                          tokenName: formData.tokenName,
                          isNFT: formData.isNFT,
                          isDurationSelect: formData.isDurationSelect,
                          duration: formData.duration,
                          isCollapsed: !formData.isCollapsed,
                          durationType: formData.durationType,
                        });
                      }}
                    >
                      {dictionary.durationAccordion}
                      <span
                        className={`-me-1 ms-auto h-5 w-5 shrink-0 ${fields[index].isCollapsed ? 'rotate-[-180deg]' : 'rotate-0'} [&>svg]:h-6 [&>svg]:w-6`}
                      >
                        <Arrow />
                      </span>
                    </button>
                  </h2>
                  <div className={`!visible ${fields[index].isCollapsed ? 'visible' : 'hidden'}`}>
                    <div className="px-5 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <FormField
                          control={control}
                          name={`formData.${index}.isDurationSelect`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center justify-center space-x-2">
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={(newCheckedState) => {
                                      field.onChange;
                                      const formData = getValues().formData[index];
                                      update(index, {
                                        tokenId: formData.tokenId,
                                        minAmount: formData.minAmount,
                                        tokenName: formData.tokenName,
                                        isNFT: formData.isNFT,
                                        isDurationSelect: newCheckedState,
                                        duration: '',
                                        isCollapsed: formData.isCollapsed,
                                        durationType: formData.durationType,
                                      });
                                    }}
                                  />
                                  <FormLabel>{dictionary.durationSwitchLabel}</FormLabel>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {getValues().formData[index].isDurationSelect ? (
                          <>
                            <FormField
                              control={control}
                              name={`formData.${index}.duration`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      value={field.value instanceof Date ? field.value.toISOString() : field.value}
                                      placeholder="0"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={control}
                              name={`formData.${index}.durationType`}
                              render={({ field }) => (
                                <FormItem>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem defaultChecked value="days">
                                        {dictionary.days}
                                      </SelectItem>
                                      <SelectItem value="weeks">{dictionary.weeks}</SelectItem>
                                      <SelectItem value="months">{dictionary.months}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        ) : (
                          <FormField
                            control={control}
                            name={`formData.${index}.duration`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={'outline'}
                                        className={cn(
                                          'min-w-[138px] pl-3 text-left font-normal sm:w-[240px]',
                                          !field.value && 'text-muted-foreground',
                                        )}
                                      >
                                        {field.value ? format(field.value, 'PPP') : <span>{dictionary.pickADate}</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={new Date(field.value || '')} onSelect={field.onChange} initialFocus />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-end sm:mr-[69px]">
          <Button
            type="button"
            onClick={() =>
              append({
                tokenId: '',
                minAmount: '0',
                tokenName: '',
                isNFT: false,
                isDurationSelect: false,
                duration: '',
                isCollapsed: false,
                durationType: 'days',
              })
            }
          >
            {dictionary.add}
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full sm:w-[68%]">
            <Button className="w-full" disabled={isBalancesFetching} type="submit">
              {isBalancesFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>{dictionary.buildList}</>}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
