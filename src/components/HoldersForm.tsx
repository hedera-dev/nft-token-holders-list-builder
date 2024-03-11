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

type HoldersFormProps = {
  setFormData: (formData: FormData['formData']) => void;
  setData: (data: any) => void;
  setShouldFetch: (shouldFetch: boolean) => void;
  isFetching: boolean;
};

export type FormData = {
  formData: { tokenId: string; minAmount: string }[];
};

export const HoldersForm = ({ setFormData, setData, setShouldFetch, isFetching }: HoldersFormProps) => {
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
    defaultValues: { formData: [{ tokenId: '', minAmount: '0' }] },
  });

  const { control, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    name: 'formData',
    control,
  });

  const onSubmit = (data: FormData) => {
    setFormData(data.formData);
    setData([]);
    setShouldFetch(true);
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
                      <Input {...field} placeholder={dictionary.exampleTokenId} />
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
              })
            }
          >
            {dictionary.add}
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full sm:w-[68%]">
            <Button className="w-full" disabled={isFetching} type="submit">
              {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>{dictionary.buildList}</>}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
