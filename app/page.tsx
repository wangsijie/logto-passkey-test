import { getLogtoContext, signIn, signOut } from "@logto/next/server-actions";
import { logtoConfig } from "./logto";
import SignOut from "./sign-out";
import SignIn from "./sign-in";
import GrantAccess from "./components/GrantAccess";
import PassKey from "./components/PassKey";
import MfaVerifications from "./components/MfaVerifications";

export default async function Home() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  return (
    <div className="p-4">
      <h1>Logto PassKey Test</h1>
      <p>{isAuthenticated ? <><span>{claims?.sub}</span>, <SignOut onSignOut={async () => {
        'use server';

        await signOut(logtoConfig);
      }} /></> : <SignIn onSignIn={async () => {
        'use server';

        await signIn(logtoConfig);
      }} />}</p>
      {isAuthenticated && <div className="pt-4">
        <MfaVerifications />
        <h2>Step 1: Grant Access</h2>
        <GrantAccess />
        <PassKey />
      </div>}
    </div>
  );
}
