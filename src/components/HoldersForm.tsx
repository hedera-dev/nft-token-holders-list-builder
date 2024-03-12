import React, { useEffect, useState } from 'react';
import dictionary from '@/dictionary/en.json';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { formSchema } from '@/utils/formSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { nodeUrl } from '@/utils/const';
import { toast } from 'sonner';
import { AccountDetails } from '@/types/accountDetails-response';

type HoldersFormProps = {
  setTokenId: (tokenId: string) => void;
  setMinAmount: (minAmount: number) => void;
  setData: (data: any) => void;
  setShouldFetch: (shouldFetch: boolean) => void;
  isBalancesFetching: boolean;
};

export const HoldersForm = ({ setTokenId, setMinAmount, setData, setShouldFetch, isBalancesFetching }: HoldersFormProps) => {
  const [tokenIdValue, setTokenIdValue] = useState('');
  const [shouldFetchAccountDetails, setShouldFetchAccountDetails] = useState(false);
  const [accountName, setAccountName] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenId: '',
      minAmount: '',
    },
  });

  const fetchTokenData = async (url: string) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${dictionary.httpError} ${response.status}`);
      }

      const data: AccountDetails = await response.json();

      setAccountName(data.name);

      setShouldFetchAccountDetails(false);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { error } = useQuery({
    enabled: shouldFetchAccountDetails,
    retry: 0,
    throwOnError: false,
    queryKey: ['accountDetails'],
    queryFn: () => fetchTokenData(`${nodeUrl}/api/v1/tokens/${tokenIdValue}`),
  });

  const onSubmit = ({ tokenId, minAmount }: z.infer<typeof formSchema>) => {
    setTokenId(tokenId);
    setMinAmount(Number(minAmount));
    setData([]);
    setShouldFetch(true);
  };

  useEffect(() => {
    if (error) {
      toast.error(error.toString());
      setAccountName(dictionary.wrongTokenId);
      setShouldFetchAccountDetails(false);
    }
  }, [error]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mt-10 flex items-start justify-center gap-2">
          <div className="w-full sm:w-1/3">
            <FormField
              control={form.control}
              name="tokenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.tokenId}</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        placeholder={dictionary.exampleTokenId}
                        {...field}
                        onChange={(e) => {
                          setTokenIdValue(e.target.value);
                          if (!e.target.value || !/^0\.0\.\d*$/.test(e.target.value)) setAccountName(undefined);
                          field.onChange(e);
                        }}
                        value={tokenIdValue}
                        onBlur={() => {
                          if (tokenIdValue && /^0\.0\.\d*$/.test(tokenIdValue)) setShouldFetchAccountDetails(true);
                          field.onBlur();
                        }}
                      />
                      {accountName && <p className="text-sm text-muted-foreground">{accountName}</p>}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full sm:w-1/3">
            <FormField
              control={form.control}
              name="minAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.minAmount}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={dictionary.minAmount} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
