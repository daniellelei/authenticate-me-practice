const express = require('express');

const { setTokenCookie, requireAuth, restoreUser,AuthErrorHandling, } = require('../../utils/auth');
const { User, Review, ReviewImage, sequelize } = require('../../db/models');
const { Spot,SpotImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');
const spot = require('../../db/models/spot');

const router = express.Router();

//get all of the current user's bookings
router.get('/current',
requireAuth,
AuthErrorHandling,
restoreUser,
async (req, res) =>{
    const userId = req.user.id;

    const allbookings = await Booking.findAll({
        where:{userId: userId},
        attributes:['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        include:Spot
    })
    // if(!allbookings.length){
    //     return res.status(404).json({
    //         "message": "You don't have a booking yet",
    //         "statusCode": 404
    //     })
    // }
    if(!allbookings.length) {
        return res.json({
        Bookings: allbookings
    })
    }
    const spots = [];
    for(let b of allbookings){
        let s = b.Spot;
        spots.push(s)
    }


    for(let b = 0; b < allbookings.length; b++){
        let spot = spots[b]
        const img = await SpotImage.findAll({
             where: {
                spotId: spot.id,
                preview: true
            },
            attributes:['url']
        })
        
        if(!img.length){
            allbookings[b].dataValues.Spot.dataValues.previewImage = "No preview image yet"
        }
        let imgUrl = img[0].dataValues.url
        allbookings[b].dataValues.Spot.dataValues.previewImage = imgUrl;
    }
    return res.json({
        Bookings: allbookings
       
    })
}
)


//edit a booking

router.put(
    '/:bookingId',
    requireAuth,
    AuthErrorHandling,
    restoreUser,

    async (req, res, next) => {
        const currentUserId = req.user.id;
        const {bookingId} = req.params;
        
        const booking = await Booking.findOne({
            where:{id:bookingId},
            attributes:['id','userId', 'spotId', 'startDate', 'endDate'],
            // include:Spot
        })
        
        //cannot find booking 
        if(!booking) {
            const err = new Error();
            
            err.message =  "Booking couldn't be found";
            //return next(err)

            return res.status(404).json({
                "message": "Booking couldn't be found",
                "statusCode": 404
            })
        }
        //belongs to current user?
        //let bookingJson = booking.toJson();
        let userId = booking.userId;
        if(currentUserId!==userId) {
            const err = new Error();
            return res.status(403).json({
                "message": "Forbidden: This booking is belonged to another user",
                "statusCode": 403
            })
        }
        //Can't edit a booking that's past the end date

        let currentDate = new Date();
        let bookingEndDate = booking.endDate;
        bookingEndDate = new Date(bookingEndDate);
        
        if(bookingEndDate.getTime() < currentDate.getTime()){
            const err = new Error();
            return res.status(403).json({
                "message": "Past bookings can't be modified",
                "statusCode": 403
            })
        }

        //body validation
        //is endDate on/before startDate
        const{startDate, endDate} = req.body;
        let newStart = new Date(startDate);
        let newEnd = new Date(endDate);
        
        let isStartDateSmaller = false;
        if(newStart.getTime()<newEnd.getTime()) {
            isStartDateSmaller = true;
        }
        if(!isStartDateSmaller) {
            const err = new Error();
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": {
                    "endDate": "endDate cannot be on or before startDate"
                }
            })
        }

        

        //Booking conflict
        //find the spotId
        const spotId = booking.spotId
        
        const allbookings = await Booking.findAll({
            where: {spotId: spotId},
            attributes: ['userId','startDate', 'endDate']
        })
       

        for(let i = 0; i < allbookings.length; i++){
            let existedBooking = allbookings[i];
            let existedBookingJson = existedBooking.toJSON();
            let existedStart = existedBookingJson.startDate;
            let existedEnd = existedBookingJson.endDate;
            let user = existedBookingJson.userId;
            if(user !== currentUserId){
            let newExistedStart = new Date(existedStart);
            let newExistedEnd = new Date(existedEnd);
            if(newStart.getTime() < newExistedStart.getTime()){
                if(newEnd.getTime()>newExistedStart.getTime()){
                    const err = new Error();
                    return res.status(403).json(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                //"startDate": "Start date conflicts with an existing booking",
                                "endDate": "End date conflicts with an existing booking"
                            }
                            }
                    )
                }
            }
            if(newStart.getTime() === newExistedStart.getTime()){
                const err = new Error();
                    return res.status(403).json(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                //"endDate": "End date conflicts with an existing booking"
                            }
                            }
                    )
            }
            if(newStart.getTime() > newExistedStart.getTime()) {
                if(newStart.getTime()<newExistedEnd.getTime()){
                    const err = new Error();
                    return res.status(403).json(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "statusCode": 403,
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                //"endDate": "End date conflicts with an existing booking"
                            }
                            }
                    )
                }
            }
            }
        }

        //no errors => edit a booking
        const currentBooking = await Booking.findOne({
            where: {id:bookingId}
        })
        
        const editBooking = await currentBooking.update({
            startDate,
            endDate,
        })
        const bookingEdited = await Booking.findOne({
            where:{id:bookingId},
            attributes:['id','spotId','userId','startDate','endDate','createdAt','updatedAt'],
            include: Spot
        })
        let spot = bookingEdited.Spot;
        const image = await SpotImage.findAll({
            where: {
                spotId: spot.id,
                preview:true
            },
            attributes:['url']
        })
        if (!image.length){
            bookingEdited.dataValues.Spot.dataValues.previewImage = 'No preview image yet.'
        }
        let imgUrl = image[0].dataValues.url
        bookingEdited.dataValues.Spot.dataValues.previewImage = imgUrl;

        return res.status(200).json(bookingEdited);
    }
)


//delete a booking
router.delete(
    '/:bookingId',
    requireAuth,
    AuthErrorHandling,
    restoreUser,
    async (req, res) => {
        //isOwner?
        const currentUserId = req.user.id;
        const {bookingId} = req.params;
        
        const booking = await Booking.findOne({
            where:{id:bookingId}
        })
        
        //cannot find booking 
        if(!booking) {
            const err = new Error();
            return res.status(404).json({
                "message": "Booking couldn't be found",
                "statusCode": 404
            })
        }
        //belongs to current user?
        //let bookingJson = booking.toJson();
        let userId = booking.userId;
        if(currentUserId!==userId) {
            const err = new Error();
            return res.status(403).json({
                "message": "Not your booking",
                "statusCode": 403
            })
        }

        //Bookings that have been started can't be deleted
        
        const startDate = booking.startDate;
        const endDate = booking.endDate;
        let newStart = new Date(startDate);
        let newEnd = new Date(endDate);
        let currentDate = new Date();
        if( newStart.getTime() <= currentDate.getTime() ){
            const err = new Error();
            return res.status(403).json({
                "message": "Bookings that have been started can't be deleted",
                "statusCode": 403
            })
        }

        const currentBooking = await Booking.findOne({
            where:{
                id:bookingId
            },
            attributes:['id']
        });
       
        // await currentBooking.destroy();
        await Booking.destroy(
            {
                where:{id:bookingId}
            }
        )
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })

        
    }
)

module.exports = router;