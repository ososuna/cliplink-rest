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
      maxAge: maxAge || 1000 * 60 * 60 * 24 * 30, // Default: 1 month
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