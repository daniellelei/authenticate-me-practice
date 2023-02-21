// backend/routes/api/session.js
const express = require('express')

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const e = require('express');
const router = express.Router();


// log in a user
router.post(
  '/',
  async (req, res, next) => {
    const { credential, password } = req.body;

    if(!credential || !password 
      || credential===undefined 
      || password === undefined) {
      const err = new Error('Validation error')
      err.status = 400;
      err.title = 'Validation error';
      err.errors = {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
      return next(err);
    }

    const user = await User.login({ credential, password });

    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = { credential: 'The provided credentials were invalid.' };
      return next(err);
    }

    await setTokenCookie(res, user);
    let currentUser = {};
    currentUser.id = user.id;
    currentUser.firstName = user.firstName;
    currentUser.lastName = user.lastName;
    currentUser.email = user.email;
    currentUser.username = user.username

    return res.json({
      user: currentUser
    });
  }
);


//invalid credentials 
router.use((err, req, res, next)=>{
  if(err.title === "Login failed"){
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

//get the current user
router.get('/', requireAuth, restoreUser, async(req, res, next) =>{

  const{id, firstName, lastName, email} = req.user;
  //const token = await setTokenCookie(res, req.user)
  const currentUser = {};
  currentUser.id = id;
  currentUser.firstName = firstName;
  currentUser.lastName = lastName;
  currentUser.email = email;
  //currentUser.token = token;

  res.status(200).json({
    user: currentUser
  })

})



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