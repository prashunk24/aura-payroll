import { Connection, clusterApiUrl, Cluster } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

const network = (process.env.SOLANA_NETWORK || 'devnet') as Cluster;
const endpoint = process.env.SOLANA_RPC_URL || clusterApiUrl(network);

export const connection = new Connection(endpoint, 'confirmed');

export const getAuraProgramId = () => {
  return process.env.AURA_PROGRAM_ID || 'BMCyG8PxXGVED95NGmYZLKT1jTPmjmGWpRPtLtqaB4EV';
};

export const getTaxVaultProgramId = () => {
  return process.env.TAX_VAULT_PROGRAM_ID || 'CwUy1nfdAQAHTXM1ehmRhdjeHdECBUSRJadHACeKXJo5';
};
