'use client';

import { PublicKeyCredentialCreationOptionsJSON, RegistrationResponseJSON, startRegistration } from "@simplewebauthn/browser";
import { useState } from "react";

export default function PassKey() {
  const [registrationOptions, setRegistrationOptions] = useState<PublicKeyCredentialCreationOptionsJSON>();
  const [newVerificationRecordId, setNewVerificationRecordId] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [passKeyResponse, setPassKeyResponse] = useState<RegistrationResponseJSON>();

  return <div>
    <h2>Step 2: Request registration options</h2>
    <button onClick={async () => {
      const verificationRecordId = localStorage.getItem('verificationRecordId');
      if (!verificationRecordId) {
        alert('No verification record id found');
        return;
      }
      const res = await fetch('/api/request-webauthn-registration', {
        method: 'POST',
        body: JSON.stringify({ verificationRecordId }),
      });
      if (!res.ok) {
        alert('Failed to request registration options');
        return;
      }
      const data = await res.json();
      console.log(data);
      setNewVerificationRecordId(data.verificationRecordId);
      setRegistrationOptions(data.registrationOptions);
      alert('Registration options requested');
    }}>Request registration options</button>
    <h2>Step 3: Register passkey in Browser</h2>
    <button disabled={!registrationOptions} onClick={async () => {
      if (!registrationOptions) {
        alert('No registration options found');
        return;
      }
      registrationOptions.user.displayName = 'test';
      const response = await startRegistration({
        optionsJSON: registrationOptions,
      });
      console.log(response);
      setPassKeyResponse(response);
      alert('Passkey registered');
    }}>Register</button>
    <h2>Step 4: Verify passkey response</h2>
    <button disabled={!passKeyResponse} onClick={async () => {
      if (!passKeyResponse) {
        alert('No passkey response found');
        return;
      }
      const res = await fetch('/api/verify-webauthn-registration', {
        method: 'POST',
        body: JSON.stringify({ verificationRecordId: newVerificationRecordId, payload: passKeyResponse }),
      });
      if (!res.ok) {
        alert('Failed to verify webauthn registration');
        return;
      }
      const data = await res.json();
      console.log(data);
      setIsVerified(true);
      alert('Webauthn registration verified');
    }}>Verify</button>
    <h2>Step 5: Bind passkey to account</h2>
    <button disabled={!isVerified} onClick={async () => {
      const verificationRecordId = localStorage.getItem('verificationRecordId');
      if (!verificationRecordId) {
        alert('No verification record id found');
        return;
      }
      const res = await fetch('/api/bind-passkey', {
        method: 'POST',
        body: JSON.stringify({ verificationRecordId, newIdentifierVerificationRecordId: newVerificationRecordId }),
      });
      if (!res.ok) {
        alert('Failed to bind passkey to account');
        return;
      }
      alert('Passkey bound to account');
    }}>Bind</button>
  </div>
}
