import { LoginPayloadDto } from 'src/auth/dtos/loginPayload.dto';

export const authorizationToLoginPayload = (authorization: string): LoginPayloadDto | undefined => {
  const authorizationSplited = authorization.split('.');

  if (authorizationSplited.length < 3) {
    return undefined;
  }

  return JSON.parse(Buffer.from(authorizationSplited[1], 'base64').toString('ascii'));
};
