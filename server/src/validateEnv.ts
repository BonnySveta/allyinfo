function validateEnv() {
  const required = [
    'JWT_SECRET',
    'INITIAL_ADMIN_USERNAME',
    'INITIAL_ADMIN_PASSWORD'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

export default validateEnv; 