const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];




// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    console.log('i passed validation');
    const { email, password, username, firstName, lastName } = req.body;
    const user = await User.signup({ email, username, password, firstName, lastName});

    const token = await setTokenCookie(res, user);
    const currentUser = {};
    currentUser.id = user.id;
    currentUser.email = user.email;
    currentUser.firstName = user.firstName;
    currentUser.lastName = user.lastName;
    currentUser.username = user.username;
    currentUser.token = token;

    return res.json({
      user: currentUser
    });
  }
);



module.exports = router;