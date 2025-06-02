'use server';

import { RegistrationResponseJSON } from '@simplewebauthn/browser';
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

export async function fetchMfaVerifications() {
  const accessToken = await getAccessToken(logtoConfig);

  const res = await fetch(
    `${logtoConfig.endpoint}/api/my-account/mfa-verifications`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch mfa verifications: ${await res.text()}`);
  }

  return res.json();
}

export async function getVerificationRecord(
  password: string
): Promise<{ verificationRecordId: string }> {
  const accessToken = await getAccessToken(logtoConfig);

  const res = await fetch(
    `${logtoConfig.endpoint}/api/verifications/password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ password }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch account info: ${await res.text()}`);
  }

  return res.json();
}

export async function requestWebauthnRegistration(
  verificationRecordId: string
) {
  const accessToken = await getAccessToken(logtoConfig);

  const res = await fetch(
    `${logtoConfig.endpoint}/api/verifications/web-authn/registration`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ verificationRecordId }),
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to request webauthn registration: ${await res.text()}`
    );
  }

  return res.json();
}

export async function verifyWebauthnRegistration(
  verificationRecordId: string,
  payload: RegistrationResponseJSON
) {
  const accessToken = await getAccessToken(logtoConfig);

  const res = await fetch(
    `${logtoConfig.endpoint}/api/verifications/web-authn/registration/verify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        verificationRecordId,
        payload: {
          ...payload,
          type: 'WebAuthn',
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to verify webauthn registration: ${await res.text()}`
    );
  }

  return res.json();
}

export async function bindPasskeyToAccount(
  verificationId: string,
  newIdentifierVerificationRecordId: string
) {
  const accessToken = await getAccessToken(logtoConfig);

  const res = await fetch(
    `${logtoConfig.endpoint}/api/my-account/mfa-verifications`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'logto-verification-id': verificationId,
      },
      body: JSON.stringify({
        newIdentifierVerificationRecordId,
        type: 'WebAuthn',
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to bind passkey to account: ${await res.text()}`);
  }

  return res.json();
}
