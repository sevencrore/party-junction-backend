const express = require('express');
const Book = require('../models/book.model');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Movie = require('../models/movie.model');
const { generatePDF } = require('./generatePDF.controller');
const { sendEmail } = require('./emailSender.controller');
const Event = require('../models/event.model');
const EventDetails = require('../models/eventDetails.model');
const City = require('../models/city.model');
const User = require('../models/user.model');
const UserWallet = require('../models/userWallet.model');


router.get("/", async (req, res) => {
    let allOrders = await Book.find({});
    res.status(200).send(allOrders);

});



router.get("/getBooking/:bookingId", async (req, res) => {
    console.log(req.params.bookingId);
    let orders = await Book.findById(req.params.bookingId);

    res.status(200).send(orders);
});


router.post("/create", async (req, res) => {
    try {
        // Log the incoming request body
        console.log(req.body);

        // Validate input data
        const { number_of_members, eventDetailsID, email, event_id, uid, displayName, user_id, price } = req.body;
        if (!number_of_members || !eventDetailsID || !email || !event_id || !uid || !displayName) {
            return res.status(400).send({ error: 'Missing required fields' });
        }


        // Step 1: Find the user by their ID
        const refer = await User.findById(user_id);

        if (refer && refer.reffered_by) {
            // Step 2: Check if 'reffered_by' exists, then find the referred user
            const referredUser = await User.findOne({ uid: refer.reffered_by });
            if (referredUser) {
                // Step 3: Retrieve the referred user's _id, email, and displayName
                const { _id: referredUserId, email, displayName } = referredUser;

                // Step 4: Search for a matching record in the UserWallet model
                let userWallet = await UserWallet.findOne({ user_id: referredUserId });

                if (!userWallet) {
                    // Step 5: If no record found, create a new UserWallet record
                    userWallet = new UserWallet({
                        user_id: referredUserId,
                        email: email,
                        name: displayName,
                        balance: price * 0.2,
                    });
                    await userWallet.save();
                } else {
                    // Step 6: If record found, update the balance
                    userWallet.balance += price * 0.2;
                    await userWallet.save();
                }
            } else {
                throw new Error('Referred user not found');
            }
        }

        // Fetch additional details from Event model
        const event = await Event.findById(event_id);
        if (!event) {
            return res.status(404).send({ error: 'Event not found' });
        }
        const event_name = event.title;
        const event_location = event.location_description;
        const city_id = event.city_id;

        // Fetch additional details from EventDetails model
        const eventDetails = await EventDetails.findById(eventDetailsID);
        if (!eventDetails) {
            return res.status(404).send({ error: 'Event details not found' });
        }
        const { date, price: price_per_head, slots: slot } = eventDetails;

        const city = await City.findById(city_id);
        if (!city) {
            return res.status(404).send({ error: 'City details not found' });
        }

        const city_name = city.name;

        // Create the booking with additional details
        const createBooking = await Book.create({
            number_of_members,
            eventDetailsID,
            email,
            event_id,
            uid,
            price,
            displayName,
            user_id,
            event_name,
            event_location,
            date,
            price_per_head,
            slot,
            city_name,
            payment: 'NOT_DONE',
        });

        // Send the response with the created booking
        res.status(201).send(createBooking);
    } catch (error) {
        // Catch and log any errors
        console.error(error);
        res.status(500).send({ error: 'An error occurred while creating the booking' });
    }
});

router.put('/update-payment/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { paymentStatus } = req.body; // e.g., 'DONE' or 'FAILED'

        if (!paymentStatus) {
            return res.status(400).send({ error: 'Missing payment status' });
        }

        // Find the booking and update the payment field
        const updatedBooking = await Book.findByIdAndUpdate(
            bookingId,
            { payment: paymentStatus },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).send({ error: 'Booking not found' });
        }

        res.status(200).send(updatedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while updating the payment status' });
    }
});


router.patch("/update/:id", async (req, res) => {

    let updatedBooking = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });


    res.status(201).send(updatedBooking);

})





router.get('/download-bill/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Fetch booking data from the database using the bookingId
        const booking = await Book.findById(bookingId); // Assuming you need to populate movie data

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const eventID = booking.event_id;

        const event = await Event.findById(eventID);
        if (!event) {
            return res.status(404).send({ error: 'Event not found' });
        }
       
        const eventImgUrl = `${process.env.IMAGE_BASE_URL}${event.img}`;
        
        // Create the HTML template for the bill
        const htmlContent = `
                        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Pass</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f4f4f4;
            height: 100vh;
        }
        .card {
            width: 600px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            position: relative;
            padding: 20px;
            border-collapse: collapse;
        }
        .background-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.3;
            z-index: -1;
        }
        table {
            width: 100%;
            margin-top: 20px;
            border: 1px solid #ddd;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #007bff;
            color: white;
            font-weight: bold;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .barcode {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 100px;
            height: 40px;
        }
        .footer {
            text-align: right;
            font-size: 14px;
            color: #555;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="card">
        <img src="${eventImgUrl}" alt="Background" class="background-img" />
        <div class="header">
            Booking Pass
            <img src="https://png.pngtree.com/png-clipart/20220620/original/pngtree-barcode-vector-design-png-image_8130545.png" alt="Barcode" class="barcode" />
        </div>
        <table>
            <tr>
                <th>Event Name</th>
                <td>${booking.event_name}</td>
            </tr>
            <tr>
                <th>Date</th>
                <td>${booking.date}</td>
            </tr>
            <tr>
                <th>Time</th>
                <td>${booking.slot}</td>
            </tr>
            <tr>
                <th>Location</th>
                <td>${booking.event_location}</td>
            </tr>
            <tr>
                <th>Number of Booking</th>
                <td>${booking.number_of_members}</td>
            </tr>
            <tr>
                <th>Total Price</th>
                <td>&#x20B9; ${booking.price}</td>
            </tr>
        </table>
        <div class="footer">
            www.thepartyjunction.com
        </div>
    </div>
</body>
</html>


        `;

        // Pass the HTML content to the pdfconverter controller to generate and send PDF
        generatePDF(htmlContent, res, booking._id);

        // const sendInvoiceEmail = async (req, res) => {


        //     // Define the email content
        //     const htmlContent = `
        //         <h1>Invoice</h1>
        //         <p>Please find attached your invoice.</p>
        //     `;

        //     // Define the path to the attachment file
        //     const attachmentPath = path.join(__dirname, '../../uploads/pdfs', `bill_${booking._id}.pdf`);

        //     // Call sendEmail with the attachment
        //     const result = await sendEmail({
        //         to: booking.email,
        //         subject: 'Your Invoice',
        //         htmlContent,
        //         attachments: [
        //             {
        //                 filename: 'invoice_12345.pdf',
        //                 path: attachmentPath
        //             }
        //         ]
        //     });

        //     if (result.success) {
        //         res.status(200).json({ message: 'Invoice email sent successfully!' });
        //     } else {
        //         res.status(500).json({ message: 'Failed to send invoice email.', error: result.error });
        //     }
        // };

        // sendEmail();

    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Error generating bill PDF', error: error.message });
    }
});



// Get a single userBookings detail by user_ID, 
router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Query to fetch user bookings where payment is DONE
        const userBookings = await Book.find({
            user_id: id, // Match user ID
            payment: 'DONE' // Filter for payment status
        });

        // If no bookings are found, return a 404 response
        if (!userBookings || userBookings.length === 0) {
            return res.status(404).json({ message: "No completed bookings found for the user." });
        }

        // Return the filtered bookings
        res.status(200).send(userBookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Error fetching user bookings.", error });
    }
});




// Get a single userBookings detail by user_ID, 
router.get('/user/email/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const userBookings = await Book.find(
            { email: email }, // Filters
        );

        if (!userBookings) {
            return res.status(404).json({ message: "User Booking details not found ." });
        }

        res.status(200).send(userBookings);

    } catch (error) {
        console.error("Error fetching userBookings detail:", error);
        res.status(500).json({ message: "Error fetching userBookings detail.", error });
    }
});




module.exports = router;