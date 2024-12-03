import dotenv from 'dotenv';

// Загружаем .env только в development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET!
  },
  admin: {
    username: process.env.INITIAL_ADMIN_USERNAME!,
    password: process.env.INITIAL_ADMIN_PASSWORD!
  }
}; 