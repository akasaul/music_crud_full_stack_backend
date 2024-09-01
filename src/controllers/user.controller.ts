import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { RefreshToken } from "../models/refresh-token.model";
import { generateTokens } from "../utils";
import type { Request, Response } from "express";
import { getTokenInfo } from "../utils";

export const signup = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const user_email = await User.findOne({ email: body.email });

    if (user_email) {
      let message = `${user_email.email} already exists`;
      return res.status(400).json({ error: true, message });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const new_user = await User.create({ ...body, password: hashedPassword });

    return res.status(201).json({
      error: false,
      message: "User created successfully",
      user: {
        name: new_user.name,
        email: new_user.email,
        role: new_user.role,
        _id: new_user._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const invalid_error_object = {
      error: true,
      message: "Username or password is wrong",
    };

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(invalid_error_object);
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json(invalid_error_object);
    }

    const tokens = await generateTokens(user);

    res.status(200).json({
      error: false,
      message: "User logged in successfully",
      access_token: tokens?.access_token,
      user: {
        name: user.name,
        email: user.email,
        roles: user.role,
        _id: user._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const current_user = req.body.user;
  const user_id = JSON.parse(current_user)._id;

  try {
    const refresh_token_doc = await RefreshToken.findOne({ user_id: user_id });
    const token_info = getTokenInfo({
      token: refresh_token_doc?.refresh_token || "",
      token_type: "refresh",
    });

    if (token_info?.user && token_info?.is_valid_token) {
      const tokens = await generateTokens(token_info?.user);
      return res.status(200).json({
        error: false,
        user: token_info?.user,
        access_token: tokens?.access_token,
        message: "Token refreshed successfully",
      });
    }

    return res.status(200).json({
      error: true,
      status: 407,
      message: "Refresh token is not valid or not found. Login Again.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const validate = async (req: Request, res: Response) => {
  const token = req.body.access_token;

  const is_valid_token = getTokenInfo(token)?.is_valid_token;

  if (is_valid_token) {
    res.status(200).json({
      error: false,
      message: "Token is valid",
    });
  } else {
    refresh(req, res);
  }
};
