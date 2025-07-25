import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinaryUpload } from "../utils/fileUpload.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponses.js";

const genrateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.createAccessToken();
    const refreshtoken = await user.generateRefreshToken();

    user.refreshtoken = refreshtoken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshtoken };
  } catch (error) {
    return next(new ApiError(401, "somthing went wrong while genrating token"));
  }
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

const loginUser = asyncHandler(async (req, res, next) => {
  // get email and password from frontEnd
  // check emal exist or not
  // check password is correct or not
  // if password is correct generate access token and refresh token and set in cookies
  //res

  const { userName, email, password } = req.body;

  if (!userName && !email) {
    return next(new ApiError(400, "userName or email are required"));
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    return next(new ApiError(404, "userName or email are not exist"));
  }

  const isPaswordMatch = await user.isCorrectPassword(password);

  if (!isPaswordMatch) {
    return next(new ApiError(401, "invalid credentials"));
  }

  const { refreshtoken, accessToken } = await genrateAccessAndRefreshToken(
    user._id
  );

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshtoken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinUser,
          accessToken,
          refreshtoken,
        },
        "userlogin successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshtoken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingToken = req.cookies?.refreshtoken || req.body.refreshtoken;

  if (!refreshtoken) {
    return next(new ApiError(401, "unauthorized request"));
  }

  try {
    const decodedToken = jwt.verify(incommingToken, process.env.REFRESH_TOKEN);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return next(new ApiError(401, "Invalid refresh token"));
    }

    if (incommingToken !== user?.refreshtoken) {
      return next(new ApiError(401, "refresh token is expaired or used"));
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshtoken } = genrateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshtoken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshtoken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    return next(new ApiError(401, err.message || "Invalid  token"));
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
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
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
