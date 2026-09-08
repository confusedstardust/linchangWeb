export type AuthUser = {
  id: string;
  email: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  providers: Array<"email" | "wechat">;
};

export type SessionJwtPayload = {
  sub: string;
  email: string | null;
  providers: Array<"email" | "wechat">;
  jti: string;
};
