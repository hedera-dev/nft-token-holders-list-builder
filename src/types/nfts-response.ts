type NFT = {
  account_id: string;
  created_timestamp: string;
  delegating_spender: null;
  deleted: boolean;
  metadata: string;
  modified_timestamp: string;
  serial_number: number;
  spender: null;
  token_id: string;
};

type Links = {
  next: null | string;
};

export type NftsResponseType = {
  nfts: NFT[];
  links: Links;
};
