import { LogtoNextConfig, UserScope } from '@logto/next';

export const logtoConfig: LogtoNextConfig = {
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  endpoint: process.env.LOGTO_ENDPOINT || 'http://localhost:3001',
  baseUrl: process.env.LOGTO_BASE_URL || 'http://localhost:3000',
  cookieSecret: 'complex_password_at_least_32_characters_long',
  cookieSecure: process.env.NODE_ENV === 'production',
  scopes: [UserScope.Profile, UserScope.Identities, 'address'],
};
