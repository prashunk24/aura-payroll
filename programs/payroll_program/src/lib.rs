use anchor_lang::prelude::*;

declare_id!("BMCyG8PxXGVED95NGmYZLKT1jTPmjmGWpRPtLtqaB4EV");

#[program]
pub mod payroll_program {
    use super::*;

    pub fn process_payroll(ctx: Context<ProcessPayroll>, total_amount: u64, tax_amount: u64) -> Result<()> {
        let net_amount = total_amount.checked_sub(tax_amount).ok_or(ErrorCode::MathOverflow)?;

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.employer.to_account_info(),
                to: ctx.accounts.employee.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, net_amount)?;

        let cpi_context_tax = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.employer.to_account_info(),
                to: ctx.accounts.tax_vault.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context_tax, tax_amount)?;

        Ok(())
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Calculation overflowed")]
    MathOverflow,
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
