const constant = {
  DOMAIN_NAME: 'SWAP',
  DOMAIN_VERSION: '2',
  SECONDS_IN_DAY: 86400,
  EMPTY_ADDRESS: '0x0000000000000000000000000000000000000000',
  ONE_ETH: 1000000000000000000,
  ERC721_INTERFACE_ID: '0x80ac58cd',
  ERC20_INTERFACE_ID: '0x277f8169',
  signatures: {
    INTENDED_VALIDATOR: '0x00',
    SIGN_TYPED_DATA: '0x01',
    PERSONAL_SIGN: '0x45',
  },
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Order: [
      { name: 'nonce', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
      { name: 'maker', type: 'Party' },
      { name: 'taker', type: 'Party' },
      { name: 'affiliate', type: 'Party' },
    ],
    Party: [
      { name: 'wallet', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'param', type: 'uint256' },
      { name: 'kind', type: 'bytes4' },
    ],
  },
  defaults: {
    Party: {
      wallet: '0x0000000000000000000000000000000000000000',
      token: '0x0000000000000000000000000000000000000000',
      param: '0',
      kind: '0x277f8169',
    },
  },
};
