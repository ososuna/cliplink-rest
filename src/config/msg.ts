export const Messages = {
  BAD_CREDENTIALS: 'Invalid email or password. Please double-check your credentials and try again.',
  INVALID_EMAIL_REGISTER: 'This email address cannot be used to create an account. Please use a different email address.',
  INVALID_EMAIL_LOGIN: 'This email address cannot be used to log in. Please check the address or use a different one.',
  INVALID_EMAIL: 'The email address provided is not valid. Please enter a valid email address.',
  TOKEN_GENERATION_ERROR: 'An error occurred while generating the token. Please try again later.',
  SEND_EMAIL_ERROR: 'There was an issue sending the email. Please try again later.',
  INVALID_PAGE_AND_LIMIT: 'Page and limit must be positive integers. Please adjust your input and try again.',
  USER_NOT_FOUND: 'We could not find a user matching the provided information.',
  URL_NOT_FOUND: 'The requested URL could not be found. Please check and try again.',
  GITHUB_ACCESS_TOKEN_ERROR: 'Unable to retrieve the GitHub access token. Please try again later.',
  GITHUB_USER_DATA_ERROR: 'Unable to fetch GitHub user data. Please ensure your GitHub account is accessible.',
  GOOGLE_ACCESS_TOKEN_ERROR: 'Unable to retrieve the Google access token. Please try again later.',
  GOOGLE_USER_DATA_ERROR: 'Unable to fetch Google user data. Please ensure your Google account is accessible.',
  INVALID_PASSWORD_TOKEN: 'The password reset token is invalid or has expired. Please request a new token.',
  REQUIRED_FIELD: (field: string): string => `The ${field} field is required. Please provide a value.`,
  INTERNAL_SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  LOGOUT_SUCCESSFUL: 'You have been successfully logged out.',
  EMAIL_SUCCESSFUL: 'The email was sent successfully. Please check your inbox.',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
  MISSING_TOKEN: 'Token is missing',
  MISSING_PASSWORD: 'Password is missing',
};
