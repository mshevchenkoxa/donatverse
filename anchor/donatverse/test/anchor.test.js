"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var anchor_1 = require("@coral-xyz/anchor");
var web3_js_1 = require("@solana/web3.js");
var anchor_2 = require("@coral-xyz/anchor");
// Импортируйте ваш IDL (например, import idl from './idl.json';)
var idl_json_1 = require("./idl.json"); // путь к вашему idl
// === НАСТРОЙКИ ===
var programId = new web3_js_1.PublicKey("BJeRvtGt4WrWAu8GGz3FKJd7jbY4gnyqHwLRGxJQjw5J");
var connection = new anchor_1.web3.Connection(anchor_1.web3.clusterApiUrl("devnet"), "confirmed");
// Создаем провайдера (использует кошелек из Playground)
var privateKey = new Uint8Array([125, 3, 217, 32, 170, 135, 56, 86, 211, 166, 60, 139, 91, 217, 141, 152, 7, 143, 251, 212, 178, 29, 65, 118, 38, 96, 4, 160, 39, 190, 201, 147, 221, 101, 14, 73, 143, 152, 184, 18, 215, 224, 140, 20, 33, 138, 7, 163, 88, 184, 72, 62, 160, 76, 87, 227, 48, 111, 189, 242, 100, 106, 170, 243]);
var wallet = anchor_1.web3.Keypair.fromSecretKey(privateKey);
var provider = new anchor_1.AnchorProvider(connection, new anchor_2.Wallet(wallet), { commitment: "confirmed" });
var program = new anchor_1.Program(idl_json_1.default, provider);
var donor = provider.wallet.publicKey;
var recipient = new web3_js_1.PublicKey("FCq6SSTuktKQ7KsENVNLdcQANewbuAWeojqqGRVKiv4W"); // замените на нужный адрес
var amountSol = 1; // сумма в SOL
var amountLamports = amountSol * anchor_1.web3.LAMPORTS_PER_SOL;
// === ВЫЧИСЛЯЕМ TIMESTAMP ===
var timestamp = Math.floor(Date.now() / 1000);
// === ВЫЧИСЛЯЕМ PDA ===
var donationPda = (await web3_js_1.PublicKey.findProgramAddress([
    Buffer.from("donation"),
    donor.toBuffer(),
    recipient.toBuffer(),
    Buffer.from(timestamp.toString()),
], programId))[0];
var programAuthority = (await web3_js_1.PublicKey.findProgramAddress([Buffer.from("authority")], programId))[0];
// === ВЫЗЫВАЕМ ФУНКЦИЮ ===
await program.methods
    .initializeDonation(new anchor_1.BN(amountLamports))
    .accounts({
    donation: donationPda,
    donor: donor,
    recipient: recipient,
    programAuthority: programAuthority,
    systemProgram: web3_js_1.SystemProgram.programId,
})
    .rpc();
console.log("Донат успешно создан!");
console.log("donation PDA:", donationPda.toBase58());
console.log("programAuthority:", programAuthority.toBase58());
console.log("timestamp:", timestamp);
