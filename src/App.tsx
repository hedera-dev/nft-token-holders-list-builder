import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { nodeUrl } from '@/utils/const';
import { Balance } from '@/types/balances-return';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import dictionary from '@/dictionary/en.json';
import { FormData, HoldersForm } from '@/components/HoldersForm';
import { Switch } from '@/components/ui/switch';

const App = () => {
  const [formData, setFormData] = useState<FormData['formData']>([]);
  const [data, setData] = useState<Balance[]>([]);
  const [responses, setResponses] = useState<Balance[][]>([]);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isAllConditionsRequired, setIsAllConditionsRequired] = useState<boolean>(true);

  const copyToClipboard = async (textToCopy: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(dictionary.copiedToClipboard);
      return;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;

      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }
  };

  const filterData = (responses: Balance[][], isAllConditionsRequired: boolean): Balance[] => {
    let data = responses.flatMap((response) => response);

    if (isAllConditionsRequired) {
      return data.filter(
        (balance, index, self) =>
          self.findIndex((b) => b.account === balance.account) === index &&
          responses.every((response) => response.some((b) => b.account === balance.account)),
      );
    } else {
      return data.filter((balance, index, self) => self.findIndex((b) => b.account === balance.account) === index);
    }
  };

  const fetchData = async (url: string): Promise<Balance[]> => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${dictionary.httpError} ${response.status}`);
    }

    const data = await response.json();

    let nextData: Balance[] = [];
    if (data.links.next) {
      nextData = await fetchData(`${nodeUrl}${data.links.next}`);
    }

    return [...data.balances, ...nextData];
  };

  const fetchAllData = async () => {
    try {
      const responses = await Promise.all(
        formData.map(async (item) => {
          const tokenId = item.tokenId;
          const minAmount = item.minAmount;
          const url = `${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.balance=gte:${minAmount}&limit=100`;
          return fetchData(url);
        }),
      );

      setResponses(responses);
      setData(filterData(responses, isAllConditionsRequired));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const { error, isFetching, isFetched, isSuccess } = useQuery({
    enabled: shouldFetch,
    retry: 0,
    throwOnError: false,
    queryKey: ['queryList'],
    queryFn: () => fetchAllData(),
  });

  useEffect(() => {
    if (!isFetching && isSuccess) toast.success(dictionary.successfullyFetchedData);
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (error) {
      toast.error(error.toString());
    }
  }, [error]);

  useEffect(() => {
    if (!isFetching && isFetched) setShouldFetch(false);
  }, [isFetched, isFetching]);

  useEffect(() => {
    setData(filterData(responses, isAllConditionsRequired));
  }, [isAllConditionsRequired]);

  return (
    <div className="container mx-auto">
      <h1 className="mt-20 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">{dictionary.title}</h1>
      <p className="text-center leading-7 [&:not(:first-child)]:mt-6">{dictionary.description}</p>

      <div className="mt-5 flex items-center justify-center space-x-2">
        <Switch id="isAllConditionsRequired" onCheckedChange={setIsAllConditionsRequired} checked={isAllConditionsRequired} />
        <Label htmlFor="isAllConditionsRequired">{dictionary.isAllConditionsRequiredLabel}</Label>
      </div>

      <div className="mb-20 mt-5">
        <HoldersForm setFormData={setFormData} setData={setData} setShouldFetch={setShouldFetch} isFetching={isFetching} />
      </div>

      {isFetched || isFetching ? (
        isFetching ? (
          <div className="flex w-full flex-col space-y-3">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="!mt-5 h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="grid w-full gap-5">
              <Label htmlFor="holders">
                {dictionary.found} {data.length || 0} {dictionary.holders}
              </Label>
              <Textarea
                readOnly
                className="min-h-[200px]"
                id="holders"
                value={JSON.stringify(Array.isArray(data) ? data.map((item) => item.account) : [])}
              />
              <Button
                onClick={async () => {
                  await copyToClipboard(JSON.stringify(data.map((item) => item.account)));
                }}
              >
                {dictionary.copyToClipboard}
              </Button>
            </div>
          </>
        )
      ) : null}
    </div>
  );
};

export default App;
