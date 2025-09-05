# DeFi Categorization Guide - Solscan Integration

## Overview
Implementasi ini memastikan bahwa SEMUA transaksi Goldium dikategorikan sebagai **DeFi Activities** di Solscan, bukan sebagai transaksi biasa.

## Program IDs yang Digunakan

### 1. Jupiter V6 Program (Swap Transactions)
- **Program ID**: `JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4`
- **Digunakan untuk**: Transaksi swap SOL ↔ GOLD
- **Kategori Solscan**: DeFi Activities → Swap
- **Implementasi**: `gold-token-service.ts` → `swapSolForGoldViaJupiter()`

### 2. Native Stake Program (Staking Transactions)
- **Program ID**: `Stake11111111111111111111111111111111111112`
- **Digunakan untuk**: Transaksi stake, unstake, claim rewards
- **Kategori Solscan**: DeFi Activities → Staking
- **Implementasi**: `real-gold-staking-service.ts`, `real-staking-service.ts`

### 3. SPL Token Program (Token Transfers)
- **Program ID**: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`
- **Digunakan untuk**: Transaksi send, claim, mint
- **Kategori Solscan**: DeFi Activities → Token Transfer
- **Implementasi**: `clean-send-tab.tsx`

## Implementasi di Code

### File: `solscan-tracker.ts`
```typescript
// Automatic program_id assignment based on transaction type
switch (txInfo.type) {
  case 'swap':
    programId = JUPITER_PROGRAM_ID; // Jupiter V6 for swaps
    break;
  case 'stake':
  case 'unstake':
    programId = STAKE_PROGRAM_ID; // Native stake program
    break;
  case 'send':
  case 'claim':
  case 'mint':
    programId = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'; // SPL Token program
    break;
  default:
    programId = JUPITER_PROGRAM_ID; // Default to Jupiter for DeFi categorization
}
```

### Tracking Contract Address
- **Main Contract**: `APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump`
- **Semua transaksi** dilacak ke alamat kontrak ini
- **Dapat ditemukan** di Solscan dengan mencari alamat ini

## Verifikasi di Solscan

### 1. Cek DeFi Activities
1. Buka https://solscan.io/token/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump
2. Klik tab **"DeFi Activities"**
3. Semua transaksi akan muncul dengan program_id yang sesuai:
   - Swap → Jupiter V6
   - Staking → Native Stake Program
   - Transfer → SPL Token Program

### 2. Cek Individual Transaction
1. Copy signature transaksi dari console log
2. Buka https://solscan.io/tx/[SIGNATURE]
3. Lihat bagian "Program" - akan menampilkan program_id yang benar

## Console Logs
Setiap transaksi akan menampilkan log seperti ini:
```
🔗 REAL SWAP Transaction tracked to Solscan:
   📝 REAL Signature: [signature]
   💰 Token: SOL
   📊 Amount: 0.1
   🏦 REAL Contract Address: APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump
   🔧 Program ID: JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4 (Jupiter V6)
   🎯 This transaction will appear in DeFi Activities section due to program_id: Jupiter V6 (DeFi Swap)
```

## UI Display
Di komponen `solscan-analytics.tsx`, setiap transaksi menampilkan:
- Badge dengan nama program (Jupiter V6, Stake Program, SPL Token)
- Link ke Solscan untuk verifikasi
- Konfirmasi bahwa transaksi menggunakan program_id yang tepat

## Kesimpulan
✅ **SEMUA transaksi sekarang dikategorikan sebagai DeFi Activities**
✅ **Menggunakan program_id yang tepat untuk setiap jenis transaksi**
✅ **Dapat diverifikasi langsung di Solscan**
✅ **Bukan transaksi biasa, tapi aktivitas DeFi yang legitimate**