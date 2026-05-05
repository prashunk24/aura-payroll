import { Connection, clusterApiUrl, Cluster } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

const network = (process.env.SOLANA_NETWORK || 'devnet') as Cluster;
const endpoint = process.env.SOLANA_RPC_URL || clusterApiUrl(network);

export const connection = new Connection(endpoint, 'confirmed');

export const getAuraProgramId = () => {
  // Placeholder for the actual program ID once deployed
  return process.env.AURA_PROGRAM_ID || 'AuraPayrollProgram11111111111111111111111';
};
