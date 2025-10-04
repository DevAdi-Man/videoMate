import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload } from "../utils/fileUpload.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponses.js";
// genrateAccessAndRefreshToken
const genrateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const accessToken = await user.createAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshtoken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res, next) => {
  // first get user
  // check user email alredy exist or not
  // if user email exist retun without register in database
  // if user not exist then check password and email vlidated or not
  // after checking validation save the user in database
  const { userName, fullname, email, password } = req.body;

  if (!userName || !email || !fullname || !password) {
    return next(new ApiError(409, "All filds are required"));
  }

  const userExist = await User.findOne({
    $or: [{ userName }, { email }],
  });

  //   todo: add more validation

  if (userExist) {
    return next(new ApiError(409, "user already exist"));
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    return next(new ApiError(400, "avatar fild are required "));
  }

  const avatar = await cloudinaryUpload(avatarLocalPath);
  const coverImage = await cloudinaryUpload(coverImageLocalPath);

  if (!avatar) {
    return next(new ApiError(400, "avatar fild are required"));
  }

  const user = await User.create({
    userName,
    email,
    fullname,
    avatar: {
      url: avatar.url,
      public_Id: avatar.public_Id,
    },
    coverImage: {
      url: coverImage?.url || "",
      public_Id: coverImage?.public_Id || "",
    },
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createdUser) {
    return next(new ApiError(500, "something went worng while registing user"));
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (!userName && !email) {
    return next(new ApiError(400, "userName or email are required"));
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    return next(new ApiError(404, "userName or email not found"));
  }

  const isPasswordMatch = await user.isCorrectPassword(password);
  if (!isPasswordMatch) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshtoken: 1 } });
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// REFRESH ACCESS TOKEN
const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingToken = req.cookies?.refreshToken || req.body.refreshToken;
  if (!incomingToken) return next(new ApiError(401, "Unauthorized request"));

  try {
    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN);
    const user = await User.findById(decodedToken._id);

    if (!user) return next(new ApiError(401, "Invalid refresh token"));
    if (incomingToken !== user.refreshtoken)
      return next(new ApiError(401, "Refresh token expired or used"));

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (err) {
    return next(new ApiError(401, err.message || "Invalid token"));
  }
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPaswordMatch = user.isCorrectPassword(oldPassword);

  if (!isPaswordMatch) {
    return next(new ApiError(401, "Invalid old password"));
  }

  user.password = newPassword;
  user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "your password is changed"));
});
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname && !email) {
    return next(new ApiError(400, "All fields are required"));
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  // const avatarLocalPath = req.file?.avatar?.path

  if (!avatarLocalPath) {
    return next(new ApiError("Avatar file is missing"));
  }

  const avatar = cloudinaryUpload(avatarLocalPath);

  if (!avatar.url) {
    return next(new ApiError(400, "Error while uploading on avatar"));
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    return next(new ApiError(400, "Cover image file is missing"));
  }

  const coverImage = await cloudinaryUpload(coverImageLocalPath);

  if (!coverImage.url) {
    return next(new ApiError(400, "Error while uploading on avatar"));
  }

  const user = await User.findOneAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getChannelProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  if (!userName?.trim()) {
    return next(new ApiError(400, "username is missing"));
  }

  const channel = await User.aggregate([
    {
      $match: {
        userName: userName?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subcribersCount: {
          $size: "$subscribers",
        },

        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [
                req.user._id,
                {
                  $map: {
                    input: "$subscribers",
                    as: "s",
                    in: "$$s.subscriber",
                  },
                },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        userName: 1,
        fullname: 1,
        subcribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);

  if (!channel?.length) {
    return next(new ApiError(404, "channel not exist"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchhistory",
        foreignField: "_id",
        as: "watchhistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchhistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getChannelProfile,
  getWatchHistory,
};
