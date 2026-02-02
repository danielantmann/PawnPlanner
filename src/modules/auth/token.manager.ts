let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenManager = {
  setTokens: (access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
  },

  clear: () => {
    accessToken = null;
    refreshToken = null;
  },

  getAccessToken: () => accessToken,
  getRefreshToken: () => refreshToken,
};
