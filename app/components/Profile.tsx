'use client';

import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/userinfo');
      const profile = await res.json();
      setProfile(profile);
    }

    fetchProfile();
  }, []);
  return <div>
    {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
    <button onClick={async () => {
      await fetch('/api/userinfo', {
        method: 'POST',
        body: JSON.stringify({ address }),
      });
      alert('Address updated');
    }}>Update Address</button>
  </div>
}
