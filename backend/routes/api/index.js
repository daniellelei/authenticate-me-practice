// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewRouter = require('./reviews.js')
const bookingsRouter = require('./bookings.js')
const spotImagesRouter = require('./spot-images.js')
const reviewImageRouter = require('./review-images.js')
const { restoreUser, requireAuth } = require('../../utils/auth.js');

router.get('/test', requireAuth, (req, res) => {
  res.json({message: 'success'})
})

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewRouter);

router.use('/bookings', bookingsRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/review-images', reviewImageRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;

