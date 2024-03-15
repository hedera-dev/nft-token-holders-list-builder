import { DurationType } from '@/components/HoldersForm';

export type Balance = {
  account: string;
  balance: number;
  decimals: number;
};

export type BalancesWithNFT = {
  account: string;
  balance: number;
  decimals: number;
  isNFT: boolean;
  durationType: DurationType;
  isDurationSelect: boolean;
  minAmount: string;
  tokenId: string;
  duration?: string | Date;
};

type Links = {
  next: null | string;
};

export type ResponseType = {
  timestamp: string;
  balances: Balance[];
  links: Links;
};
