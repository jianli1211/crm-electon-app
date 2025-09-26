
import Grid from "@mui/material/Grid";
import { WalletItem } from "./wallet-item";

export const walletList = [
  {
    key: "tron",
    name: 'Tron',
    label: "Tron",
    contract: "trx",
    symbol: 'TRXUSD',
    logo: '/assets/wallets/tron.svg',
    unit: 'TRX',
  },
  {
    key: "trc20",
    name: 'Tether',
    label: "Tether (trc20)",
    contract: "trc20",
    symbol: 'TRXUSDT',
    logo: '/assets/wallets/tether.svg',
    unit: 'USDT',
  },
  {
    key: "ethereum",
    name: 'Ethereum',
    label: 'Ethereum',
    contract: "eth",
    symbol: 'ETHUSD',
    logo: '/assets/wallets/eth.svg',
    unit: 'ETH',
  },
  {
    key: "erc20",
    name: 'Tether',
    label: "Tether (erc20)",
    contract: "erc20",
    symbol: 'ETHUSDT',
    logo: '/assets/wallets/tether.svg',
    unit: 'USDT',
  },
  {
    key: "binance_smart_chain",
    name: 'Binance',
    label: "BNB",
    contract: "bsc",
    symbol: 'BNBUSD',
    logo: '/assets/wallets/bnb.svg',
    unit: 'BNB',
  },
  {
    key: "bsc20",
    name: 'Tether',
    label: "Tether (bep20)",
    contract: "bsc20",
    symbol: 'BNBUSDT',
    logo: '/assets/wallets/tether.svg',
    unit: 'USDT',
  },
  {
    key: "usdc_eth",
    name: 'USDC-ETH',
    label: "ETH-USDC",
    contract: "eth",
    symbol: 'ETHUSDC',
    logo: '/assets/wallets/usdc.svg',
    unit: 'USDC',
  },
  {
    key: "usdc_bsc",
    name: 'USDC-BSC',
    label: "BNB-USDC",
    contract: "bsc",
    symbol: 'BNBUSDC',
    logo: '/assets/wallets/usdc.svg',
    unit: 'USDC',
  },
  {
    key: "solana",
    name: 'Solana',
    label: "SOL",
    contract: "sol",
    symbol: 'SOLUSD',
    logo: '/assets/wallets/solana.svg',
    unit: 'SOL',
  },
]

export const WalletsList = ({ wallets }) => {
  return (
    <Grid container spacing={4} sx={{ mt: 3 }}>
      {walletList.map((item, index) => (
        <Grid item xs={6} key={`${item.id}-${index}`}>
          <WalletItem item={item} info={wallets[item.key]} />
        </Grid>
      ))}
    </Grid>
  );
};
