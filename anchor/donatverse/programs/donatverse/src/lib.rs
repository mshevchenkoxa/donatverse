use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke_signed, system_instruction};
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};
use solana_program::program::invoke;


declare_id!("BJeRvtGt4WrWAu8GGz3FKJd7jbY4gnyqHwLRGxJQjw5J");
#[program]
pub mod donatverse {
    use super::*;

    pub fn initialize_donation(ctx: Context<InitializeDonation>, amount: u64) -> Result<()> {
        let donation = &mut ctx.accounts.donation;
        donation.donor = *ctx.accounts.donor.key;
        donation.recipient = *ctx.accounts.recipient.key;
        donation.amount = amount;
        donation.confirmed = false;

        
        invoke(
            &system_instruction::transfer(
                ctx.accounts.donor.key,
                ctx.accounts.program_authority.key,
                amount,
            ),
            &[
                ctx.accounts.donor.to_account_info(),
                ctx.accounts.program_authority.clone(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        Ok(())
    }

    pub fn confirm_donation(ctx: Context<ConfirmDonation>) -> Result<()> {
        let donation = &mut ctx.accounts.donation;

        require!(
            donation.recipient == *ctx.accounts.recipient.key,
            CustomError::InvalidRecipient
        );
        require!(!donation.confirmed, CustomError::AlreadyConfirmed);

        
        let cpi_accounts = MintTo {
            mint: ctx.accounts.nft_mint.to_account_info(),
            to: ctx.accounts.nft_account.to_account_info(),
            authority: ctx.accounts.program_authority.clone(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let signer_seeds: &[&[&[u8]]] = &[&[b"authority", &[ctx.bumps.program_authority]]];

        token::mint_to(
            CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds),
            1,
        )?;

        
        invoke_signed(
            &system_instruction::transfer(
                ctx.accounts.program_authority.key,
                ctx.accounts.recipient.key,
                donation.amount,
            ),
            &[
                ctx.accounts.program_authority.clone(),
                ctx.accounts.recipient.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            signer_seeds,
        )?;

        donation.confirmed = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeDonation<'info> {
    #[account(init, payer = donor, space = 8 + 32 + 32 + 8 + 1)]
    pub donation: Account<'info, Donation>,
    #[account(mut)]
    pub donor: Signer<'info>,
    
    pub recipient: UncheckedAccount<'info>,
    #[account(seeds = [b"authority"], bump)]
    T
    pub program_authority: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ConfirmDonation<'info> {
    #[account(mut)]
    pub donation: Account<'info, Donation>,
    #[account(mut)]
    pub recipient: SystemAccount<'info>,
    #[account(mut)]
    pub nft_mint: Account<'info, Mint>,
    #[account(mut)]
    pub nft_account: Account<'info, TokenAccount>,
    #[account(seeds = [b"authority"], bump)]
    
    pub program_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Donation {
    pub donor: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub confirmed: bool,
}

#[error_code]
pub enum CustomError {
    #[msg("Donation already confirmed")]
    AlreadyConfirmed,
    #[msg("Only the recipient can confirm this donation")]
    InvalidRecipient,
}
