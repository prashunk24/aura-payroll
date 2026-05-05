use anchor_lang::prelude::*;

declare_id!("TaxVault11111111111111111111111111111111111");

#[program]
pub mod tax_vault_program {
    use super::*;

    pub fn deposit_tax(ctx: Context<DepositTax>, amount: u64) -> Result<()> {
        // Funds held in PDA until yield allocation or withdrawal
        Ok(())
    }

    pub fn allocate_to_yield(ctx: Context<AllocateYield>, amount: u64) -> Result<()> {
        // CPI to Yield Vault Program
        Ok(())
    }
}

#[derive(Accounts)]
pub struct DepositTax<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = payer,
        space = 8 + 32,
        seeds = [b"tax_vault", payer.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, TaxVaultAccount>,
    pub system_program: Program<'info>,
}

#[derive(Accounts)]
pub struct AllocateYield<'info> {
    pub authority: Signer<'info>,
    #[account(mut)]
    pub vault: Account<'info, TaxVaultAccount>,
    /// CHECK: PDA of the yield vault
    #[account(mut)]
    pub yield_vault: AccountInfo<'info>,
}

#[account]
pub struct TaxVaultAccount {
    pub total_tax_withheld: u64,
}
