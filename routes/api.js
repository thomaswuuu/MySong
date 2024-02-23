const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");
const updateContorller = require("../controllers/updateController");
const auth = require("../controllers/authController");
const passport = require("passport");

// Login and create token
router.post(
  "/login",
  // #swagger.ignore = true
  passport.authenticate("local"),
  auth.createAuthToken
);

// Add middleware and check login token for super user and normal user
router.use("/charts", auth.normalAuthCheck);
router.get(
  "/charts",
  /* #swagger.tags = ["charts"]
     #swagger.summary = 'Get chart list of queried platform'
     #swagger.parameters['platform'] = {
        in: 'query',
        required: 'true',
        description: 'Platform(KKBOX/Spotify)',
        type: 'string'
     }
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  indexController.getCharts
);
router.use("/charts", auth.superAuthCheck);
router.post(
  "/charts",
  /* #swagger.tags = ["charts"]
     #swagger.summary = 'Create chart list of queried platform'
     #swagger.parameters['platform'] = {
        in: 'query',
        required: 'true',
        description: 'Platform(KKBOX/Spotify)',
        type: 'string'
     }
     #swagger.security = [{
        "bearerAuth": []
      }]
  */
  indexController.setCharts
);
router.put(
  "/charts",
  /* #swagger.tags = ["charts"]
     #swagger.summary = 'Update chart list of queried platform'
     #swagger.parameters['platform'] = {
        in: 'query',
        required: 'true',
        description: 'Platform(KKBOX/Spotify)',
        type: 'string'
     }
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  indexController.updateCharts
);
router.delete(
  "/charts",
  // #swagger.ignore = true
  indexController.deleteCharts
);

router.use("/tracks", auth.normalAuthCheck);
router.get(
  "/tracks",
  /* #swagger.tags = ["tracks"]
     #swagger.summary = 'Get track list of queried platform and playlist_id'
     #swagger.parameters['platform'] = {
        in: 'query',
        required: 'true',
        description: 'Platform(KKBOX/Spotify)',
        type: 'string'
     }
     #swagger.parameters['id'] = {
        in: 'query',
        required: 'true',
        description: 'Playlist Id',
        type: 'string'
     }
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  indexController.getTracks
);
router.use("/tracks", auth.superAuthCheck);
router.post(
  "/tracks",
  /* #swagger.tags = ["tracks"]
     #swagger.summary = 'Create track list of queried platform and playlist_id'
     #swagger.parameters['platform'] = {
        in: 'query',
        required: 'true',
        description: 'Platform(KKBOX/Spotify)',
        type: 'string'
     }
     #swagger.parameters['id'] = {
        in: 'query',
        required: 'true',
        description: 'Playlist Id',
        type: 'string'
     }
     #swagger.security = [{
        "bearerAuth": []
      }]
  */
  indexController.setTracks
);
router.put(
  "/tracks",
  /* #swagger.tags = ["tracks"]
     #swagger.summary = 'Update track list of queried platform and playlist_id'
     #swagger.parameters['platform'] = {
        in: 'query',
        required: 'true',
        description: 'Platform(KKBOX/Spotify)',
        type: 'string'
     }
     #swagger.parameters['id'] = {
        in: 'query',
        required: 'true',
        description: 'Playlist Id',
        type: 'string'
     }
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  indexController.updateTracks
);
router.delete(
  "/tracks",
  // #swagger.ignore = true
  indexController.deleteTracks
);

router.use("/users", auth.superAuthCheck);
router.get(
  "/users",
  /* #swagger.tags = ["users"]
     #swagger.summary = 'Get all users list'
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  userController.getAllUsers
);
router.get(
  "/users/:user_id",
  /* #swagger.tags = ["users"]
     #swagger.summary = 'Get a specific user with user_id'
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  userController.getUser
);
router.post(
  "/users",
  /* #swagger.tags = ["users"]
     #swagger.summary = 'Add a new user'
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
                $ref: "#/components/schemas/users"
            }
          }
        }
      }
   */
  userController.setUser
);
router.put(
  "/users/:user_id",
  /* #swagger.tags = ["users"]
     #swagger.summary = 'Update user info with user_id'
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
                $ref: "#/components/schemas/users"
            }
          }
        }
      }
   */
  userController.updateUser
);
router.delete(
  "/users/:user_id",
  /* #swagger.tags = ["users"]
     #swagger.summary = 'Delete a user with user_id'
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  userController.deleteUser
);

// Add middleware and check login token for normal user
router.use("/follows", auth.normalAuthCheck);
router.get(
  "/follows",
  /* #swagger.tags = ["follows"]
     #swagger.summary = 'Get all following tracks of current login user'
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  profileController.getUserAllFollows
);
router.get(
  "/follows/:track_id",
  /* #swagger.tags = ["follows"]
     #swagger.summary = 'Get a specific following track with track_id'
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  profileController.getUserFollow
);
router.post(
  "/follows",
  /* #swagger.tags = ["follows"]
     #swagger.summary = 'Add a new following track'
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
                $ref: "#/components/schemas/follows"
            }
          }
        }
      }
   */
  profileController.setUserFollow
);
router.put(
  "/follows/:track_id",
  /* #swagger.tags = ["follows"]
     #swagger.summary = 'Update a specific following track with track_id'
     #swagger.security = [{
        "bearerAuth": []
      }]
     #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
                $ref: "#/components/schemas/follows"
            }
          }
        }
      }
   */
  profileController.updateUserFollow
);
router.delete(
  "/follows/:track_id",
  /* #swagger.tags = ["follows"]
     #swagger.summary = 'Delete a specific following track with track_id'
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  profileController.deleteUserFollow
);

// Auto Update
router.use("/autoupdate", auth.superAuthCheck);
router.get(
  "/autoupdate/:command",
  /* #swagger.tags = ["autoupdate"]
     #swagger.summary = 'Controll and check autoupdate with command'
     #swagger.parameters['command'] = {
        in: 'path',
        required: 'true',
        description: 'command: start | stop | time | status',
        type: 'string'
     }
     #swagger.security = [{
        "bearerAuth": []
      }]
   */
  updateContorller.autoUpdateTime
);

module.exports = router;
