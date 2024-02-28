import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { nodeUrl } from '@/utils/const';
import { Balance } from '@/types/balances-return';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

const App = () => {
  const [tokenId, setTokenId] = useState<string>('');
  const [minAmount, setMinAmount] = useState<number>();
  const [data, setData] = useState<Balance[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);

  const copyToClipboard = async (textToCopy: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
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

  const fetchData = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();

    setData((prevData: Balance[]) => [...prevData, ...data.balances]);

    if (data.links.next) {
      await fetchData(`${nodeUrl}${data.links.next}`);
    }
  };

  const { isFetching, isFetched } = useQuery({
    enabled: shouldFetch,
    queryKey: ['queryList'],
    queryFn: () => fetchData(`${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.balance=gte:${minAmount}&limit=100`),
  });

  const handleFetchData = () => {
    setData([]);
    setShouldFetch(true);
  };

  useEffect(() => {
    if (!isFetching && isFetched) setShouldFetch(false);
  }, [isFetched, isFetching]);

  return (
    <div className="container mx-auto">
      <h1 className="mt-20 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        Build list of holders for a Hedera collection
      </h1>
      <p className="text-center leading-7 [&:not(:first-child)]:mt-6">
        Just pass a TokenId and amount of NFTs that an accounts needs to have at minimum.
      </p>

      <div className="mt-10 flex items-center justify-center gap-2">
        <div className="w-1/3">
          <Label htmlFor="tokenId">TokenId</Label>
          <Input id="tokenId" type="text" placeholder="TokenId" value={tokenId} onChange={(event) => setTokenId(event.target.value)} />
        </div>

        <div className="w-1/3">
          <Label htmlFor="amount">Min. amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Min. amount"
            value={minAmount}
            onChange={(event) => setMinAmount(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="mb-20 mt-5 flex items-center justify-center">
        <div className="w-[68%]">
          <Button className="w-full" disabled={!tokenId || !minAmount || isFetching} onClick={handleFetchData}>
            {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Build list
          </Button>
        </div>
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
              <Label htmlFor="message">Found {data.length || 0} holders</Label>
              <Textarea
                className="min-h-[200px]"
                placeholder="Type your message here."
                id="message"
                value={JSON.stringify(data.map((item) => item.account))}
              />
              <Button
                onClick={async () => {
                  await copyToClipboard(JSON.stringify(data.map((item) => item.account)));
                }}
              >
                Copy to clipboard
              </Button>
            </div>
          </>
        )
      ) : null}
    </div>
  );
};

export default App;
