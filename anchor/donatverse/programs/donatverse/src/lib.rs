use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    program::invoke_signed, 
    system_instruction,
    sysvar::rent::Rent
};
use anchor_spl::{
    token::{self, Mint, MintTo, Token, TokenAccount, Transfer as TokenTransfer},
    metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata},
};
use mpl_token_metadata::{
    state::{DataV2, Creator, Collection, Uses, CollectionDetails}, 
    ID as METADATA_PROGRAM_ID
};

declare_id!("BJeRvtGt4WrWAu8GGz3FKJd7jbY4gnyqHwLRGxJQjw5J");

#[program]
pub mod donatverse {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let program_data = &mut ctx.accounts.program_data;
        program_data.admin = *ctx.accounts.admin.key;
        program_data.donation_count = 0;
        program_data.nft_collection = ctx.accounts.nft_mint.key();
        Ok(())
    }


    pub fn donate_sol(
        ctx: Context<DonateSol>,
        amount: u64,
        message: String,
    ) -> Result<()> {
        let donation = &mut ctx.accounts.donation;
        let program_data = &mut ctx.accounts.program_data;
       
        donation.donor = *ctx.accounts.donor.key;
        donation.recipient = *ctx.accounts.recipient.key;
        donation.amount = amount;
        donation.token = "SOL".to_string();
        donation.message = message;
        donation.created_at = Clock::get()?.unix_timestamp;
        donation.id = program_data.donation_count;
        donation.confirmed = false;
        
        invoke(
            &system_instruction::transfer(
                ctx.accounts.donor.key,
                ctx.accounts.program_sol_vault.key,
                amount,
            ),
            &[
                ctx.accounts.donor.to_account_info(),
                ctx.accounts.program_sol_vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        program_data.donation_count += 1;
        
        emit!(DonationEvent {
            donor: donation.donor,
            recipient: donation.recipient,
            amount: donation.amount,
            token: donation.token.clone(),
            message: donation.message.clone(),
            id: donation.id,
            timestamp: donation.created_at,
        });

        Ok(())
    }

   
    pub fn donate_usdt(
        ctx: Context<DonateUsdt>,
        amount: u64,
        message: String,
    ) -> Result<()> {
        let donation = &mut ctx.accounts.donation;
        let program_data = &mut ctx.accounts.program_data;
        
        donation.donor = *ctx.accounts.donor.key;
        donation.recipient = *ctx.accounts.recipient.key;
        donation.amount = amount;
        donation.token = "USDT".to_string();
        donation.message = message;
        donation.created_at = Clock::get()?.unix_timestamp;
        donation.id = program_data.donation_count;
        donation.confirmed = false;
        
        
        let cpi_accounts = TokenTransfer {
            from: ctx.accounts.donor_token_account.to_account_info(),
            to: ctx.accounts.program_token_vault.to_account_info(),
            authority: ctx.accounts.donor.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;

        program_data.donation_count += 1;
        
        emit!(DonationEvent {
            donor: donation.donor,
            recipient: donation.recipient,
            amount: donation.amount,
            token: donation.token.clone(),
            message: donation.message.clone(),
            id: donation.id,
            timestamp: donation.created_at,
        });

        Ok(())
    }

    
    pub fn confirm_donation(
        ctx: Context<ConfirmDonation>,
        metadata_uri: String,
    ) -> Result<()> {
        let donation = &mut ctx.accounts.donation;
        let program_data = &ctx.accounts.program_data;
        
        require!(
            donation.recipient == *ctx.accounts.recipient.key,
            DonateError::InvalidRecipient
        );
        require!(!donation.confirmed, DonateError::AlreadyConfirmed);

     
        let nft_mint = &ctx.accounts.nft_mint;
        let nft_token_account = &ctx.accounts.nft_token_account;
        
        
        let cpi_accounts = MintTo {
            mint: nft_mint.to_account_info(),
            to: nft_token_account.to_account_info(),
            authority: ctx.accounts.program_authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let signer_seeds = &[&b"authority"[..], &[ctx.bumps.program_authority]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        
        token::mint_to(cpi_ctx, 1)?;

        create_metadata_accounts_v3(
            CpiContext::new_with_signer(
                ctx.accounts.metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.metadata_account.to_account_info(),
                    mint: nft_mint.to_account_info(),
                    mint_authority: ctx.accounts.program_authority.to_account_info(),
                    update_authority: ctx.accounts.program_authority.to_account_info(),
                    payer: ctx.accounts.recipient.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
                signer_seeds,
            ),
            DataV2 {
                name: format!("Donation #{}", donation.id),
                symbol: "DONATE".to_string(),
                uri: metadata_uri,
                seller_fee_basis_points: 0,
                creators: Some(vec![Creator {
                    address: program_data.admin,
                    verified: true,
                    share: 100,
                }]),
                collection: None,
                uses: None,
            },
            false,  // is_mutable
            true,   // update_authority_is_signer
            None,   // collection_details
        )?;

        
        if donation.token == "SOL" {
            **ctx.accounts.recipient.to_account_info().try_borrow_mut_lamports()? += donation.amount;
            **ctx.accounts.program_sol_vault.to_account_info().try_borrow_mut_lamports()? -= donation.amount;
        } else {
            let cpi_accounts = TokenTransfer {
                from: ctx.accounts.program_token_vault.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.program_authority.to_account_info(),
            };
            
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
            
            token::transfer(cpi_ctx, donation.amount)?;
        }

        donation.confirmed = true;
        donation.confirmed_at = Clock::get()?.unix_timestamp;
        
        emit!(DonationConfirmedEvent {
            donation_id: donation.id,
            recipient: donation.recipient,
            amount: donation.amount,
            token: donation.token.clone(),
            nft_mint: nft_mint.key(),
            timestamp: donation.confirmed_at,
        });

        Ok(())
    }

   
    pub fn get_recipient_donations(
        ctx: Context<GetRecipientDonations>,
    ) -> Result<Vec<Donation>> {        
        Ok(vec![])
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + ProgramData::LEN,
        seeds = [b"program_data"],
        bump
    )]
    pub program_data: Account<'info, ProgramData>,
    
    #[account(
        init,
        payer = admin,
        seeds = [b"sol_vault"],
        bump,
        constraint = program_sol_vault.lamports() == 0
    )]
    pub program_sol_vault: SystemAccount<'info>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub nft_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(message: String)]
pub struct DonateSol<'info> {
    #[account(
        init,
        payer = donor,
        space = 8 + Donation::LEN,
        seeds = [
            b"donation",
            &program_data.donation_count.to_le_bytes(),
        ],
        bump
    )]
    pub donation: Account<'info, Donation>,
    
    #[account(mut, seeds = [b"program_data"], bump)]
    pub program_data: Account<'info, ProgramData>,
    
    #[account(mut, seeds = [b"sol_vault"], bump)]
    pub program_sol_vault: SystemAccount<'info>,
    
    #[account(mut)]
    pub donor: Signer<'info>,
    pub recipient: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(message: String)]
pub struct DonateUsdt<'info> {
    #[account(
        init,
        payer = donor,
        space = 8 + Donation::LEN,
        seeds = [
            b"donation",
            &program_data.donation_count.to_le_bytes(),
        ],
        bump
    )]
    pub donation: Account<'info, Donation>,
    
    #[account(mut, seeds = [b"program_data"], bump)]
    pub program_data: Account<'info, ProgramData>,
    
    #[account(mut, seeds = [b"token_vault"], bump)]
    pub program_token_vault: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub donor: Signer<'info>,
    
    #[account(mut)]
    pub donor_token_account: Account<'info, TokenAccount>,
    
    pub recipient: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
}