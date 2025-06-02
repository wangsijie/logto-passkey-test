'use client';

import { fetchMfaVerifications } from '@/app/account-api';
import { useEffect } from 'react';
import { useState } from 'react';

export default function MfaVerifications() {
  const [mfaVerifications, setMfaVerifications] = useState<{ id: string }[]>([]);

  useEffect(() => {
    fetchMfaVerifications().then(setMfaVerifications);
  }, []);

  return <div>
    <h2>MFA Verifications: <button onClick={() => {
      fetchMfaVerifications().then(setMfaVerifications);
    }}>Refresh</button></h2>
    <ul>
      {mfaVerifications.map((mfaVerification) => (
        <li key={mfaVerification.id}>{JSON.stringify(mfaVerification)}</li>
      ))}
    </ul>
  </div>;
}
