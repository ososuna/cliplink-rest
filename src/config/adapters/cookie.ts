interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: boolean | "none" | "lax" | "strict" | undefined;
  domain?: string;
  maxAge?: number;
}

export class CookieAdapter {
  static authCookieOptions(maxAge?: number): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.cliplink.app' : undefined,
      maxAge: maxAge || 60 * 60 // 1 hour
    };
  }
  static authClearCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.cliplink.app' : undefined
    };
  }
}