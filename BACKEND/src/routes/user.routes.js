import { Router } from "express";
import {
  changeCurrentPassword,
  getChannelProfile,
  getCurrentUser,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/verifyJwt.js";


const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },

    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/update-account").patch(verifyJwt, updateAccountDetails);
router.route("/avatar").patch(verifyJwt, upload.single("avatar"), updateAvatar);
router
  .route("/coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updateCoverImage);
router.route("/c/:userName").get(verifyJwt, getChannelProfile);
router.route("/history").get(verifyJwt, getWatchHistory);

export default router;
