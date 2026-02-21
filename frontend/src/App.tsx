import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { MintCertificate } from "./MintCertificate";

function App() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif'}}>
      <h1> SUI Certificate Minting DApp </h1>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '20px'}}>
        <ConnectButton />
      </div>
      {!useCurrentAccount ? (
        <p>Connect your wallet to get started</p>
      ) : (
        <MintCertificate />
      )}
    </div>
  );
}

export default App;
