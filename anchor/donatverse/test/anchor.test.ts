import { AnchorProvider, Program, web3, BN, Idl } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Wallet } from "@coral-xyz/anchor";
// Импортируйте ваш IDL (например, import idl from './idl.json';)
import idl from "./idl.json"; // путь к вашему idl

// === НАСТРОЙКИ ===
const programId = new PublicKey("BJeRvtGt4WrWAu8GGz3FKJd7jbY4gnyqHwLRGxJQjw5J");
const connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
// Создаем провайдера (использует кошелек из Playground)
const privateKey = new Uint8Array([125,3,217,32,170,135,56,86,211,166,60,139,91,217,141,152,7,143,251,212,178,29,65,118,38,96,4,160,39,190,201,147,221,101,14,73,143,152,184,18,215,224,140,20,33,138,7,163,88,184,72,62,160,76,87,227,48,111,189,242,100,106,170,243]);
const wallet = web3.Keypair.fromSecretKey(privateKey);
const provider = new AnchorProvider(connection, new Wallet(wallet), { commitment: "confirmed" });

const program = new Program(idl, provider);

const donor = provider.wallet.publicKey;
const recipient = new PublicKey("FCq6SSTuktKQ7KsENVNLdcQANewbuAWeojqqGRVKiv4W"); // замените на нужный адрес
const amountSol = 1; // сумма в SOL
const amountLamports = amountSol * web3.LAMPORTS_PER_SOL;

// === ВЫЧИСЛЯЕМ TIMESTAMP ===
const timestamp = Math.floor(Date.now() / 1000);

// === ВЫЧИСЛЯЕМ PDA ===
const [donationPda] = await PublicKey.findProgramAddress(
  [
    Buffer.from("donation"),
    donor.toBuffer(),
    recipient.toBuffer(),
    Buffer.from(timestamp.toString()),
  ],
  programId
);

const [programAuthority] = await PublicKey.findProgramAddress(
  [Buffer.from("authority")],
  programId
);

// === ВЫЗЫВАЕМ ФУНКЦИЮ ===
await program.methods
  .initializeDonation(new BN(amountLamports))
  .accounts({
    donation: donationPda,
    donor: donor,
    recipient: recipient,
    programAuthority: programAuthority,
    systemProgram: SystemProgram.programId,
  })
  .rpc();

console.log("Донат успешно создан!");
console.log("donation PDA:", donationPda.toBase58());
console.log("programAuthority:", programAuthority.toBase58());
console.log("timestamp:", timestamp);