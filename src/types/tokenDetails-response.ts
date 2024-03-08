type Key = {
  _type: string;
  key: string;
};

type Amount = {
  denominator: number;
  numerator: number;
};

type RoyaltyFee = {
  all_collectors_are_exempt: boolean;
  amount: Amount;
  collector_account_id: string;
  fallback_fee: null;
};

type CustomFees = {
  created_timestamp: string;
  fixed_fees: any[];
  royalty_fees: RoyaltyFee[];
};

export type TokenDetails = {
  admin_key: Key;
  auto_renew_account: string;
  auto_renew_period: number;
  created_timestamp: string;
  custom_fees: CustomFees;
  decimals: string;
  deleted: boolean;
  expiry_timestamp: number;
  fee_schedule_key: Key;
  freeze_default: boolean;
  freeze_key: null;
  initial_supply: string;
  kyc_key: null;
  max_supply: string;
  memo: string;
  modified_timestamp: string;
  name: string;
  pause_key: null;
  pause_status: string;
  supply_key: Key;
  supply_type: string;
  symbol: string;
  token_id: string;
  total_supply: string;
  treasury_account_id: string;
  type: string;
  wipe_key: null;
};
