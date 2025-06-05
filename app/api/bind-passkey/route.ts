import { bindPasskeyToAccount } from '@/app/account-api';

export async function POST(request: Request) {
  const { verificationRecordId, newIdentifierVerificationRecordId } =
    await request.json();

  try {
    await bindPasskeyToAccount(
      verificationRecordId,
      newIdentifierVerificationRecordId
    );
    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
