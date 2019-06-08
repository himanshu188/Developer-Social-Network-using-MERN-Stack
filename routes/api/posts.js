const express = require('express');
const router = express.Router();

// @route GET /api/posts/test
// Tests  Post Route
// Public Route
router.get('/test', (req,res) => res.json({
  msg: "Posts Works"
}));

module.exports = router;
