import { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

// ⚠️ GANTI DENGAN PACKAGE ID KAMU (yang 0x...)
const PACKAGE_ID = "0x978acd41adef232f44ac4f86f1f260a208c71b14aade0edebd5bb75fb20a7eec"; 

const WALRUS_PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";

export function MintCertificate() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [title, setTitle] = useState('Sertifikat Juara Coding');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadToWalrus = async (file: File): Promise<string> => {
    const response = await fetch(`${WALRUS_PUBLISHER_URL}/v1/store`, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      throw new Error("Gagal upload ke Walrus!");
    }

    const data = await response.json();
    if (data.newlyCreated && data.newlyCreated.blobObject) {
      return data.newlyCreated.blobObject.blobId;
    } else if (data.alreadyCertified) {
        return data.alreadyCertified.blobId;
    }
    
    throw new Error("Format respons Walrus tidak dikenali.");
  };
  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Pilih gambar sertifikat dulu!");
      return;
    }

    try {
      setIsUploading(true);
      
      console.log("Sedang upload ke Walrus...");
      const blobId = await uploadToWalrus(file);
      console.log("Berhasil! Blob ID:", blobId);

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::certificate::mint_to_student`,
        arguments: [
            tx.pure.string(title),
            tx.pure.string(recipientName),
            tx.pure.string(blobId), // Pakai ID asli dari Walrus!
            tx.pure.address(recipientAddress)
        ],
      });
      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log('Minting Sukses:', result);
            alert(`Sertifikat untuk ${recipientName} berhasil diterbitkan!`);
            setIsUploading(false);
          },
          onError: (err) => {
            console.error('Minting Gagal:', err);
            alert('Gagal minting di blockchain.');
            setIsUploading(false);
          },
        }
      );

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat upload gambar.");
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
      <h2>Terbitkan Sertifikat (Walrus)</h2>
      <form onSubmit={handleMint} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
            <label>Judul Sertifikat:</label>
            <input 
                style={{width: '100%', padding: '8px'}}
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
            />
        </div>

        <div>
            <label>Nama Penerima:</label>
            <input 
                style={{width: '100%', padding: '8px'}}
                value={recipientName} 
                onChange={(e) => setRecipientName(e.target.value)} 
                placeholder="Nama Mahasiswa" 
                required 
            />
        </div>

        <div>
            <label>Address Wallet Penerima:</label>
            <input 
                style={{width: '100%', padding: '8px'}}
                value={recipientAddress} 
                onChange={(e) => setRecipientAddress(e.target.value)} 
                placeholder="0x..." 
                required 
            />
        </div>

        <div style={{border: '1px dashed #aaa', padding: '10px', textAlign: 'center'}}>
            <label>Upload Gambar Sertifikat:</label>
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                    if (e.target.files) setFile(e.target.files[0]);
                }} 
                required 
            />
        </div>

        <button 
            type="submit" 
            disabled={isUploading}
            style={{ 
                padding: '12px', 
                cursor: isUploading ? 'not-allowed' : 'pointer',
                backgroundColor: isUploading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px'
            }}
        >
          {isUploading ? 'Sedang Upload ke Walrus...' : 'Mint Sertifikat Sekarang'}
        </button>
      </form>
    </div>
  );
}