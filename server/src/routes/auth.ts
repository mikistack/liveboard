import { Router } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { verifyRefreshToken, generateAccessToken } from '../utils/tokens';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await registerUser(req.body);
    
    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ user, accessToken });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ user, accessToken });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const { userId } = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken(userId);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out' });
});

export default router;
