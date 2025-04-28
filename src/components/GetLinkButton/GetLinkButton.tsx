import React, { useState, useEffect } from 'react';

const GetLinkButton: React.FC = () => {
  const [donationLink, setDonationLink] = useState<string | null>(null);
  const userWalletAddress = "YOUR_USER_WALLET_ADDRESS"; 

  useEffect(() => {
    
    if (userWalletAddress) {
      setDonationLink(`http://localhost:3000/donate?wallet=${userWalletAddress}`);
    }
  }, [userWalletAddress]);

  const handleCopyClick = () => {
    if (donationLink) {
      navigator.clipboard.writeText(donationLink);
      alert('Посилання скопійовано!');
    }
  };

  return (
    <div>
      <h2>Ваше персональне посилання для донатів:</h2>
      {donationLink ? (
        <div>
          <p>{donationLink}</p>
          <button onClick={handleCopyClick}>Скопіювати посилання</button>
        </div>
      ) : (
        <p>Будь ласка, підключіть ваш гаманець.</p>
      )}
    </div>
  );
};

export default GetLinkButton;