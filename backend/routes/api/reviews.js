const express = require('express');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spot,SpotImage } = require('../../db/models');
const { Review, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get(
    '/current',
    requireAuth,
    restoreUser,
    async(req, res)=>{
        const currentUserId = req.user.id;
        const reviews = await Review.findAll({
            where: {userId: currentUserId},
            include: [
                {model: User, attributes: ['id', 'firstName', 'lastName']},
                {model: Spot, attributes:{exclude: ['createdAt', 'updatedAt']} },
                {model: ReviewImage, attributes:{exclude: ['createdAt', 'updatedAt', 'reviewId']}}
            ]
        })






        return res.json({
            Reviews: reviews
        });

    }
)





module.exports = router;