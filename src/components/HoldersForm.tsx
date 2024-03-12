import React from 'react';
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
import { AccountDetails } from '@/types/accountDetails-response';

type HoldersFormProps = {
  setFormData: (formData: FormData['formData']) => void;
  setData: (data: any) => void;
  setShouldFetch: (shouldFetch: boolean) => void;
  isBalancesFetching: boolean;
};

export type FormData = {
  formData: { tokenId: string; minAmount: string; tokenName: string }[];
};

export const HoldersForm = ({ setFormData, setData, setShouldFetch, isBalancesFetching }: HoldersFormProps) => {
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
    schema: formSchema,
    defaultValues: { formData: [{ tokenId: '', minAmount: '0', tokenName: '' }] },
  });

  const { control, handleSubmit } = methods;

  const { fields, append, remove, update } = useFieldArray({
    name: 'formData',
    control,
  });

  const fetchTokenData = async (url: string, index: number, formData: { tokenId: string; minAmount: string; tokenName: string }) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${dictionary.httpError} ${response.status}`);
      }

      const data: AccountDetails = await response.json();

      update(index, { tokenId: formData.tokenId, minAmount: formData.minAmount, tokenName: data.name });
      return data;
    } catch (error) {
      toast.error((error as Error).toString());
      update(index, { tokenId: formData.tokenId, minAmount: formData.minAmount, tokenName: dictionary.wrongTokenId });
    }
  };

  const onSubmit = (data: FormData) => {
    setFormData(data.formData);
    setData([]);
    setShouldFetch(true);
  };

  const handleBlur = async (event: React.FocusEvent<HTMLInputElement>, index: number) => {
    const inputValue = event.target.value;
    if (inputValue && /^0\.0\.\d*$/.test(inputValue)) {
      const url = `${nodeUrl}/api/v1/tokens/${inputValue}`;
      const data = methods.getValues();
      try {
        await fetchTokenData(url, index, data.formData[index]);
      } catch (error) {
        toast.error((error as Error).toString());
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!event.target.value) {
      const data = methods.getValues();
      const formData = data.formData[index];
      update(index, {
        tokenId: formData.tokenId,
        minAmount: formData.minAmount,
        tokenName: '',
      });
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start justify-center gap-2">
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
                            handleChange(event, index);
                          }}
                          onBlur={(event) => {
                            field.onBlur();
                            handleBlur(event, index);
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

            <div className="w-full sm:w-1/3">
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
        ))}
        <div className="flex justify-end sm:mr-[69px]">
          <Button
            type="button"
            onClick={() =>
              append({
                tokenId: '',
                minAmount: '0',
                tokenName: '',
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
