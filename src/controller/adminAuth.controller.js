import {
  loginService,
  registerService,
} from '../services/authAdmin.service.js';

export const registerAdmin = async (req, res, next) => {
  try {
    const safeUser = await registerService(req.body);

    return res.status(201).json({
      message: 'Register Successful',
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { safeUser, token } = await loginService(req.body);

    return res.status(200).json({
      message: 'Login Successful',
      user: safeUser,
      token,
    });
  } catch (err) {
    next(err);
  }
};
