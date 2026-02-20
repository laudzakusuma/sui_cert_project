import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

const PACKAGE_ID = "0x978acd41adef232f44ac4f86f1f260a208c71b14aade0edebd5bb75fb20a7"; 

export function MintCertificate() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [title, setTitle] = useState('Certificate of Completion');
  const [recipientName, setRecipientName] = useState('');
  const [blobId, setBlobId] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();

    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::certificate::mint_to_student`,
      arguments: [
        tx.pure.string(title),
        tx.pure.string(recipientName),
        tx.pure.string(blobId),
        tx.pure.address(recipientAddress)
      ],
    });

    // Memanggil fungsi eksekusi di sini
    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: (result: any) => {
          console.log('Transaction Result:', result);
          alert(`Certificate has been minted to ${recipientName}!`);
        },
        onError: (err: any) => {
          console.error('Error:', err);
          alert('Failed to mint certificate. Please check the console for details.');
        },
      }
    );
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
      <h2>Mint Certificate</h2>
      <form onSubmit={handleMint} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <label>title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Recipient Name:</label>
        <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Contoh: Budi" required />

        <label>Walrus Blob ID (ID Gambar):</label>
        <input value={blobId} onChange={(e) => setBlobId(e.target.value)} placeholder="Contoh: 8A7y..." required />

        <label>Recipient Address:</label>
        <input value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="0x..." required />

        <button type="submit" style={{ padding: '10px', marginTop: '10px', cursor: 'pointer' }}>
          Mint & Kirim Sertifikat
        </button>
      </form>
    </div>
  );
}