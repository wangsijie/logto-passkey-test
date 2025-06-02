'use client';

import { useState } from "react";

export default function GrantAccess() {
  const [password, setPassword] = useState('');

  return <div>
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button disabled={!password} onClick={async () => {
      const res = await fetch('/api/get-verification-record', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      const { verificationRecordId } = await res.json();
      if (!verificationRecordId) {
        alert('No verification record id found');
        return;
      }
      localStorage.setItem('verificationRecordId', verificationRecordId);
      alert(`Verification record id: ${verificationRecordId} saved to localStorage`);
      setPassword('');
    }}>Get a verification record by password</button>
  </div>
}
