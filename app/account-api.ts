'use server';

import { logtoConfig } from './logto';
import { getAccessToken } from '@logto/next/server-actions';

export async function fetchAccountInfo() {
  const accessToken = await getAccessToken(logtoConfig);

  const res = await fetch(`${logtoConfig.endpoint}/api/my-account`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch account info: ${await res.text()}`);
  }

  return res.json();
}

export async function updateUserAddress(address: string) {
  const accessToken = await getAccessToken(logtoConfig);

  const res = await fetch(`${logtoConfig.endpoint}/api/my-account/profile`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address: { formatted: address } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update user address: ${await res.text()}`);
  }

  return res.json();
}
