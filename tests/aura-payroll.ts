import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PayrollProgram } from "../target/types/payroll_program";
import { TaxVaultProgram } from "../target/types/tax_vault_program";
import { expect } from "chai";
import { 
  PublicKey, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from "@solana/web3.js";

describe("aura-payroll", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const payrollProgram = anchor.workspace.PayrollProgram as Program<PayrollProgram>;
  const taxVaultProgram = anchor.workspace.TaxVaultProgram as Program<TaxVaultProgram>;
  
  const provider = anchor.getProvider();
  const employer = (provider as anchor.AnchorProvider).wallet;
  const employee = anchor.web3.Keypair.generate();

  it("Processes payroll and splits funds", async () => {
    const totalAmount = new anchor.BN(1 * LAMPORTS_PER_SOL);
    const taxAmount = new anchor.BN(0.18 * LAMPORTS_PER_SOL);

    // Derive Tax Vault PDA
    const [taxVaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("tax_vault"), employer.publicKey.toBuffer()],
      payrollProgram.programId
    );

    const initialEmployeeBalance = await provider.connection.getBalance(employee.publicKey);

    await payrollProgram.methods
      .processPayroll(totalAmount, taxAmount)
      .accounts({
        employer: employer.publicKey,
        employee: employee.publicKey,
        taxVault: taxVaultPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const finalEmployeeBalance = await provider.connection.getBalance(employee.publicKey);
    expect(finalEmployeeBalance - initialEmployeeBalance).to.equal(
      totalAmount.toNumber() - taxAmount.toNumber()
    );
  });

  it("Deposits tax into the vault", async () => {
    const depositAmount = new anchor.BN(0.18 * LAMPORTS_PER_SOL);

    await taxVaultProgram.methods
      .depositTax(depositAmount)
      .accounts({
        payer: employer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const [vaultPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("tax_vault"), employer.publicKey.toBuffer()],
      taxVaultProgram.programId
    );
    
    const vaultAccount = await taxVaultProgram.account.taxVaultAccount.fetch(vaultPDA);
    expect(vaultAccount.totalTaxWithheld.toNumber()).to.be.at.least(depositAmount.toNumber());
  });
});
