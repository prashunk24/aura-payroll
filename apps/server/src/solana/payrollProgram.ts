import { 
  connection, 
  getAuraProgramId 
} from './client';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionInstruction
} from '@solana/web3.js';
import { logger } from '../lib/logger';

/**
 * Constructs an unsigned transaction for the employer to sign.
 * This transaction splits the payment between the employee and the Aura Tax Vault.
 */
export const createPayrollTransaction = async (
  employerWallet: string,
  employeeWallet: string,
  amount: number,
  taxAmount: number
) => {
  logger.info({ employerWallet, employeeWallet, amount, taxAmount }, 'Constructing payroll transaction');

  const employerPubkey = new PublicKey(employerWallet);
  const employeePubkey = new PublicKey(employeeWallet);
  const programId = new PublicKey(getAuraProgramId());

  // Derive PDA for the Tax Vault (seeds: [b"tax_vault", employer_key])
  const [taxVaultPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("tax_vault"), employerPubkey.toBuffer()],
    programId
  );

  const transaction = new Transaction();

  // Instruction: process_payroll(total_amount, tax_amount)
  // We'll mock the discriminator and data for now as we don't have the IDL-generated client
  // Discriminator for 'process_payroll' would usually be something like:
  // sha256("global:process_payroll")[..8]
  const data = Buffer.alloc(8 + 8 + 8);
  // Placeholder discriminator (Anchor uses first 8 bytes)
  // In a real app, we'd use @coral-xyz/anchor to get this
  data.writeBigUInt64LE(BigInt("0x1234567890abcdef"), 0); // Placeholder
  data.writeBigUInt64LE(BigInt(amount * LAMPORTS_PER_SOL), 8);
  data.writeBigUInt64LE(BigInt(taxAmount * LAMPORTS_PER_SOL), 16);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: employerPubkey, isSigner: true, isWritable: true },
      { pubkey: employeePubkey, isSigner: false, isWritable: true },
      { pubkey: taxVaultPDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data: data,
  });

  transaction.add(instruction);

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = employerPubkey;

  return transaction.serialize({ requireAllSignatures: false }).toString('base64');
};

/**
 * Polls for transaction confirmation and returns true if successful.
 */
export const confirmTransaction = async (signature: string) => {
  if (signature.startsWith('mock_signature_')) {
    logger.info({ signature }, 'Mock signature detected, instantly confirming');
    return true;
  }
  const result = await connection.confirmTransaction(signature, 'confirmed');
  return !result.value.err;
};
