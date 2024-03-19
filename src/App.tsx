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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { nodeUrl } from '@/utils/const';
import { Balance, BalancesWithNFT, ResponseType } from '@/types/balances-response';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import dictionary from '@/dictionary/en.json';
import { TokenDetails } from '@/types/tokenDetails-response';
import { DurationType, FormData, HoldersForm } from '@/components/HoldersForm';
import { Switch } from '@/components/ui/switch';
import { createFetchUrl } from '@/utils/createFetchUrl';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { filterBalances } from '@/utils/filterBalances';
import { fetchNftsWithDuration } from '@/utils/fetchNftsWithDuration';

const App = () => {
  const [tokenDetailsList, setTokenDetailsList] = useState<TokenDetails[]>([]);
  const [formData, setFormData] = useState<FormData['formData']>([]);
  const [data, setData] = useState<Balance[]>([]);
  const [responses, setResponses] = useState<BalancesWithNFT[][]>([]);
  const [filteredBalancesData, setFilteredBalancesData] = useState<BalancesWithNFT[]>([]);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [isAllConditionsRequired, setIsAllConditionsRequired] = useState<boolean>(true);
  const [progress, setProgress] = useState(0);

  const filterData = async (responses: BalancesWithNFT[][], isAllConditionsRequired: boolean): Promise<Balance[]> => {
    let data = responses.flatMap((response) => response);
    let nftBalances = await fetchNftsWithDuration(
      data.filter((item) => item.isNFT),
      setProgress,
    );
    let nonNftBalances = data.filter((item) => !item.isNFT);

    const filteredBalancesData = [...nftBalances, ...nonNftBalances];
    setFilteredBalancesData(filteredBalancesData);

    return filterBalances(filteredBalancesData, isAllConditionsRequired, responses);
  };

  const fetchData = async (
    url: string,
    isNFT: boolean,
    durationType: DurationType,
    isDurationSelect: boolean,
    minAmount: string,
    tokenId: string,
    duration?: string | Date,
  ): Promise<BalancesWithNFT[]> => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${dictionary.httpError} ${response.status}`);
    }

    const data: ResponseType = await response.json();

    let nextData: BalancesWithNFT[] = [];
    if (data.links.next) {
      nextData = await fetchData(`${nodeUrl}${data.links.next}`, isNFT, durationType, isDurationSelect, minAmount, tokenId, duration);
    }

    const balancesWithNFT: BalancesWithNFT[] = data.balances.map((balance: Balance) => ({
      ...balance,
      isNFT,
      durationType,
      isDurationSelect,
      minAmount,
      tokenId,
      duration,
    }));

    return [...balancesWithNFT, ...nextData];
  };

  const fetchAllData = async () => {
    setProgress(0);
    try {
      const progressIncrement = 50 / formData.length;
      const promises = formData.map(async (item) => {
        const { tokenId, minAmount, isNFT, duration, durationType, isDurationSelect } = item;
        const url = createFetchUrl(tokenId, minAmount, isNFT, tokenDetailsList);
        const data = await fetchData(url, isNFT, durationType, isDurationSelect, minAmount, tokenId, duration);
        setProgress((prevProgress) => prevProgress + progressIncrement);
        return data;
      });

      const responses = await Promise.all(promises);
      setResponses(responses);
      setData(await filterData(responses, isAllConditionsRequired));

      return data;
    } catch (error) {
      toast.error((error as Error).toString());
    }
  };

  const { error, isFetching, isFetched, isSuccess } = useQuery({
    enabled: shouldFetch,
    retry: 0,
    queryKey: ['balancesList'],
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
    setData(filterBalances(filteredBalancesData, isAllConditionsRequired, responses));
  }, [isAllConditionsRequired]);

  return (
    <div className="container mx-auto">
      <h1 className="mt-20 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">{dictionary.title}</h1>
      <p className="text-center leading-7 [&:not(:first-child)]:mt-6">{dictionary.description}</p>

      <div className="mt-5 flex items-center justify-center space-x-2 sm:-ml-[50px]">
        <Label className={`${isAllConditionsRequired && 'text-muted-foreground'}`} htmlFor="isAllConditionsRequired">
          {dictionary.isAllConditionsRequiredLabelLeft}
        </Label>
        <Switch className="!bg-primary" id="isAllConditionsRequired" onCheckedChange={setIsAllConditionsRequired} checked={isAllConditionsRequired} />
        <Label className={`${!isAllConditionsRequired && 'text-muted-foreground'}`} htmlFor="isAllConditionsRequired">
          {dictionary.isAllConditionsRequiredLabelRight}
        </Label>
      </div>

      <div className="mb-20 mt-5">
        <HoldersForm
          setFormData={setFormData}
          setData={setData}
          setShouldFetch={setShouldFetch}
          isBalancesFetching={isFetching}
          setTokenDetailsList={setTokenDetailsList}
          tokenDetailsList={tokenDetailsList}
          progress={progress}
        />
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
            <div className="mb-10 grid w-full gap-5">
              <Label htmlFor="holders">
                {dictionary.found} {data.length || 0} {dictionary.holders}
              </Label>
              <Textarea
                readOnly
                className="min-h-[200px]"
                id="holders"
                value={Array.isArray(data) ? data.map((item) => item.account).join(', ') : ''}
              />
              <Button
                onClick={async () => {
                  await copyToClipboard(Array.isArray(data) ? data.map((item) => item.account).join(', ') : '');
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
