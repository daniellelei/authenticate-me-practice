// backend/routes/api/session.js
const express = require('express')

const { setTokenCookie, requireAuth, restoreUser,AuthErrorHandling } = require('../../utils/auth');
const { User } = require('../../db/models');
const e = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
// log in a user
const validateLogin = [
  check('credential')
  .exists({checkFalsy: true})
  .withMessage("Email or username is required"),
  check('password')
  .exists({checkFalsy: true})
  .withMessage("Password is required"),
  handleValidationErrors,
  validateErrorhandling,
]
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    // if(!credential || !password 
    //   || credential===undefined 
    //   || password === undefined) {
    //   const err = new Error('Validation error')
    //   err.status = 400;
    //   err.title = 'Validation error';
    //   err.errors = {
    //     "credential": "Email or username is required",
    //     "password": "Password is required"
    //   }
    //   return next(err);
    // }

    const user = await User.login({ credential, password });

    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Invalid credentials';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    await setTokenCookie(res, user);


    return res.json({
      user: user
    });
  }
);


//invalid credentials 
router.use((err, req, res, next)=>{
  if(err.title === "Invalid credentials"){
    res.status (err.status) 
    return res.json({
      message: err.title,
      statusCode: err.status
    })
  }
  return next(err);
  
})



//validation errors
router.use((err, req, res, next)=>{
  if(err.title === 'Validation error'){
    res.status (err.status)
    return res.json({
      message: err.title,
      statusCode: err.status,
      errors: err.errors
    })
  }
  return next(err);
  
})

// //get the current user
// router.get('/', 
// //requireAuth, 
// restoreUser,
// AuthErrorHandling,
// async(req, res, next) =>{
//   if(!req.user) res.status(200).json({
//     user:null
//   })

//   const{id, firstName, lastName, email, username} = req.user;
//   //const token = await setTokenCookie(res, req.user)
//   const currentUser = {
//     id,
//     firstName,
//     lastName,
//     email,
//     username
//   };
 
//   res.status(200).json({
//     user: currentUser
//   })

// })



// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({ user: null });
  }
);

module.exports = router;