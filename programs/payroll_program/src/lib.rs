use anchor_lang::prelude::*;

declare_id!("Payroll1111111111111111111111111111111111111");

#[program]
pub mod payroll_program {
    use super::*;

    pub fn process_payroll(ctx: Context<ProcessPayroll>, amount: u64, tax_split: u64) -> Result<()> {
        // 1. Transfer Net Salary to Employee
        // 2. CPI to Tax Vault Program to deposit Tax funds
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProcessPayroll<'info> {
    #[account(mut)]
    pub employer: Signer<'info>,
    #[account(mut)]
    pub employee: SystemAccount<'info>,
    /// CHECK: PDA of the tax vault
    #[account(mut)]
    pub tax_vault: AccountInfo<'info>,
    pub system_program: Program<'info>,
}
