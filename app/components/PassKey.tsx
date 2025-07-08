'use client';

import { PublicKeyCredentialCreationOptionsJSON, RegistrationResponseJSON, startRegistration, PublicKeyCredentialRequestOptionsJSON, AuthenticationResponseJSON, startAuthentication } from "@simplewebauthn/browser";
import { useState } from "react";

export default function PassKey() {
  const [registrationOptions, setRegistrationOptions] = useState<PublicKeyCredentialCreationOptionsJSON>();
  const [newVerificationRecordId, setNewVerificationRecordId] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [passKeyResponse, setPassKeyResponse] = useState<RegistrationResponseJSON>();
  
  // WebAuthn verification states
  const [authenticationOptions, setAuthenticationOptions] = useState<PublicKeyCredentialRequestOptionsJSON>();
  const [authVerificationId, setAuthVerificationId] = useState<string>();
  const [authResponse, setAuthResponse] = useState<AuthenticationResponseJSON>();
  const [isAuthVerified, setIsAuthVerified] = useState(false);

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
    
    <hr className="my-8" />
    
    <h2>WebAuthn Verification (Using Existing Passkey)</h2>
    
    <h3>Step 1: Request authentication options</h3>
    <button onClick={async () => {
      const verificationRecordId = localStorage.getItem('verificationRecordId');
      if (!verificationRecordId) {
        alert('No verification record id found');
        return;
      }
      const res = await fetch('/api/request-webauthn-authentication', {
        method: 'POST',
        body: JSON.stringify({ verificationRecordId }),
      });
      if (!res.ok) {
        alert('Failed to request authentication options');
        return;
      }
      const data = await res.json();
      console.log(data);
      setAuthVerificationId(data.verificationId);
      setAuthenticationOptions(data.authenticationOptions);
      alert('Authentication options requested');
    }}>Request authentication options</button>
    
    <h3>Step 2: Authenticate with existing passkey</h3>
    <button disabled={!authenticationOptions} onClick={async () => {
      if (!authenticationOptions) {
        alert('No authentication options found');
        return;
      }
      try {
        const response = await startAuthentication({
          optionsJSON: authenticationOptions,
        });
        console.log(response);
        setAuthResponse(response);
        alert('Authentication completed');
      } catch (error) {
        console.error('Authentication failed:', error);
        alert('Authentication failed');
      }
    }}>Authenticate</button>
    
    <h3>Step 3: Verify authentication response</h3>
    <button disabled={!authResponse} onClick={async () => {
      if (!authResponse || !authVerificationId) {
        alert('No authentication response or verification ID found');
        return;
      }
      const verificationRecordId = localStorage.getItem('verificationRecordId');
      if (!verificationRecordId) {
        alert('No verification record id found');
        return;
      }
      const res = await fetch('/api/verify-webauthn-authentication', {
        method: 'POST',
        body: JSON.stringify({ 
          verificationRecordId: authVerificationId, 
          payload: authResponse 
        }),
      });
      if (!res.ok) {
        alert('Failed to verify webauthn authentication');
        return;
      }
      setIsAuthVerified(true);
      alert('WebAuthn authentication verified successfully!');
    }}>Verify authentication</button>
    
    {isAuthVerified && (
      <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
        <p className="text-green-700">✅ WebAuthn verification completed successfully!</p>
      </div>
    )}
  </div>
}
