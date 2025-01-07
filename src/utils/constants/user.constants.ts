export const USER_REGEX = {
  PASSWORD:
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,16}$/,
  NICKNAME: /^[a-zA-Z0-9가-힣]{2,20}$/,
};
