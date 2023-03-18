// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );
  //console.log('setTokenCookie, token: ', token)
  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  //console.log('restoreUser function running')
  const { token } = req.cookies;
  req.user = null;
  //console.log('restoreUser Token: ',token)

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    
    if (err) {
      //console.log('if err running, then next', err)
      
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope('currentUser').findByPk(id);
      //console.log('after query', req.user)
    } catch (e) {
      //console.log('catch running')
      res.clearCookie('token');
      return next();
    }
    //console.log('req.user', req.user)
    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
}

const AuthErrorHandling = function (err, req, res, next) {
  if(err) {
    if(err.title === 'Authentication required'){
      return res.status(err.status).json({
        "message": "Authentication required",
        "statusCode": 401
      })
    }
  }
  return next();
}


module.exports = { setTokenCookie, restoreUser, requireAuth, AuthErrorHandling };