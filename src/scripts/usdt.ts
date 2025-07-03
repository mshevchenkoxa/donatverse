import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Donatverse } from './donatverse'; 

interface DonateParams {
  program: Program<Donatverse>;
  donor: web3.Keypair;
  recipient: PublicKey;
  amount: number; 
  message?: string;
}

interface DonateUsdtParams extends DonateParams {
  donorTokenAccount: PublicKey;
  recipientTokenAccount: PublicKey;
  usdtMint: PublicKey;
}

export async function donateUsdt({
  program,
  donor,
  recipient,
  amount,
  donorTokenAccount,
  recipientTokenAccount,
  usdtMint,
  message = '',
}: DonateUsdtParams): Promise<string> {
  
  const programData = await getProgramDataPDA(program);
  const donationCount = (await program.account.programData.fetch(programData)).donationCount;
  
  const [donationPDA] = await getDonationPDA(program, donationCount);
  const [tokenVaultPDA] = await getTokenVaultPDA(program);

  const tx = await program.methods
    .donateUsdt(
      new BN(amount),
      message
    )
    .accounts({
      donation: donationPDA,
      programData,
      programTokenVault: tokenVaultPDA,
      donor: donor.publicKey,
      donorTokenAccount,
      recipient,
      recipientTokenAccount,
      mint: usdtMint,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .signers([donor])
    .rpc();

  return tx;
}

async function getTokenVaultPDA(program: Program<Donatverse>): Promise<PublicKey> {
  return (await PublicKey.findProgramAddressSync(
    [Buffer.from('token_vault')],
    program.programId
  ))[0];
}