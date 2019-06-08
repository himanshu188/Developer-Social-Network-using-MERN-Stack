const express = require('express');
const router = express.Router();

// @route GET /api/users/test
// Tests  Users Route
// Public Route
router.get('/test', (req,res) => res.json({
  msg: "Users Works"
}));

module.exports = router;
