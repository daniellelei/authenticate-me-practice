const express = require('express');

const { setTokenCookie, requireAuth, restoreUser,AuthErrorHandling } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({checkFalsy: true})
    .withMessage('First Name is required'),
  check('lastName')
    .exists({checkFalsy: true})
    .withMessage('Last Name is required'),
  handleValidationErrors
  //validateErrorhandling
];

//check if email is unique
const checkIfExists = async(req, res, next) =>{
  const {email, username} = req.body
  
  const user = await User.findAll({
    where:{
      email: email
    }
  })
  
  if(user.length){
    const err = new Error();
    err.message = "User already exists"
    err.status = 403
    err.errors= {"email": "User with that email already exists"}
    next(err);
  }

  const user1 = await User.findAll({
    where:{
      username: username
    }
  })
  if(user1.length){
    const err = new Error();
    err.message = "User already exists"
    err.status = 403
    err.errors= {"username": "User with that username already exists"}
    next(err);
  }

  await next();
}

const validateErrorhandling = (err, req, res, next)=>{
  if(err){
    res.status(err.status)
    return res.json({
      message: err.message,
      statusCode: err.status,
      errors: err.errors
    })
  }

  next();
}



// Sign up a user
router.post(
  '/',
  validateSignup,
  checkIfExists,
  validateErrorhandling,
  async (req, res) => {
    
    const { email, password, username, firstName, lastName } = req.body;
    const user = await User.signup({ email, username, password, firstName, lastName});

    return res.json(
      user
  
    );
  }
);



module.exports = router;