const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Post model
const Post = require("../../models/Post");

//Profile model
const Profile = require("../../models/Profile");

// Validation
const validatePostInput = require("../../validation/post");

// @route GET /api/posts/test
// Tests  Post Route
// Public Route
router.get("/test", (req, res) =>
  res.json({
    msg: "Posts Works"
  })
);

// @route GET api/posts
// @desc  Get Post
// @access Public

router.get("/", (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({nopostsfound: "No Posts Found"}));
});

// @route GET api/post/:id
// @desc  Get Post by Id
// @access Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({nopostfound: "No Post Found"}));
});

// @route POST api/posts
// @desc  Create Post
// @access Private
router.post("/", passport.authenticate("jwt", {session: false}), (req, res) => {
  const {errors, isValid} = validatePostInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any Errors, send 400 with erros object
    return res.status(400).json(errors);
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

// @route DELETE api/posts/:id
// @desc  Delete Post
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", {session: false}),
  (req, res) => {
    Profile.findOne({user: req.user.id}).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({notauthorized: "User not authorized"});
          }

          // DELETE
          post.remove().then(() => {
            res.json({success: true});
          });
        })
        .catch(err => res.status(404).json({postnotfound: "No Post Found"}));
    });
  }
);

// @route POST api/posts/like/:id
// @desc  Like Post
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", {session: false}),
  (req, res) => {
    Profile.findOne({user: req.user.id})
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({alreadyliked: "User already Liked This Post"});
          }

          // Add User id to likes array
          post.likes.unshift({user: req.user.id});

          post.save().then(post => res.json(post));
        });
      })
      .catch(err => res.status(404).json({postnotfound: "No Post Found"}));
  }
);

// @route POST api/posts/unlike/:id
// @desc  Unlike Post
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", {session: false}),
  (req, res) => {
    Profile.findOne({user: req.user.id})
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({notliked: "You have not yet liked this post"});
          }

          // Get the remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          post.save().then(post => res.json(post));
        });
      })
      .catch(err => res.status(404).json({postnotfound: "No Post Found"}));
  }
);

// @route POST api/posts/comment/:id
// @desc  Add comment to post
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", {session: false}),
  (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any Errors, send 400 with erros object
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to Comments Array
        post.comments.unshift(newComment);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.stats(404).json({postnotfound: "No Post Found"}));
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc  Remove comment from post
// @access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", {session: false}),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
          // Check if comment exists
          if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
            return res.status(404).json({ commentnotexist: 'Comment doesn\'t exist'})
          }

          // Get remove indexOf
          const removeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);

          // Splice comment out of Array
          post.comments.splice(removeIndex, 1);

          post.save().then(post => res.json(post));
      })
      .catch(err => res.stats(404).json({postnotfound: "No Post Found"}));
  }
);

module.exports = router;
