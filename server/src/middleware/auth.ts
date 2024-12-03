import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import { db, adminQueries } from '../db';
import { config } from '../config';
import { Admin } from '../types/admin';

const JWT_SECRET = config.jwt.secret;

export const login = async (req: Request, res: Response) => {
  console.log('\n=== Login Attempt ===');
  console.log('Username:', req.body.username);
  const { username, password } = req.body;

  try {
    // Ищем пользователя в базе
    console.log('Looking for user in database...');
    const admin = adminQueries.findByUsername.get(username) as Admin | undefined;

    if (!admin) {
      console.log('User not found');
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    // Проверяем пароль
    console.log('Checking password...');
    const isValidPassword = await bcryptjs.compare(password, admin.password_hash);

    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    console.log('Password verified, updating last login...');
    // Обновляем время последнего входа
    adminQueries.updateLastLogin.run(admin.id);

    // Создаем JWT токен
    console.log('Generating JWT token...');
    const token = jwt.sign(
      { 
        userId: admin.id,
        isAdmin: true 
      }, 
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful');
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
  console.log('===================\n');
};

export const verifyToken = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    // Проверяем существование пользователя в базе
    const admin = adminQueries.findById.get(decoded.userId) as Admin | undefined;

    if (!admin) {
      return res.status(401).json({ message: 'Недействительный токен' });
    }

    res.json({ isValid: true });
  } catch (error) {
    res.status(401).json({ message: 'Недействительный токен' });
  }
}; 