const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));



app.use((req,res,next)=>{   


 //   console.log(req.headers);
 
    next()
})
const userController = require('./controllers/user.controller');
const movieController = require('./controllers/movie.controller');
const bookController = require('./controllers/book.controller');
const eventController = require('./controllers/event.controller');
const slotPriceController = require("./controllers/slotPrice.controller");
const eventCategoryController = require("./controllers/category.controller");
const vendorController = require("./controllers/vendor.controller");
const cityController = require("./controllers/city.controller");
const EventDeatilsController = require('./controllers/eventDetails.controller');
const SlideImageController = require('./controllers/slideImage.controller');
const UserWalletController = require('./controllers/userWallet.controller');
const CoupanCodeController = require('./controllers/couponCode.Controller');
const paymentController = require('./controllers/payment.controller');
app.use("/users",userController);
app.use("/movies",movieController);
app.use("/book",bookController);
app.use("/slotprice",slotPriceController)
const theaterController = require('./controllers/theater.controller');
app.use("/users",userController);
app.use("/movies",movieController);
app.use("/book",bookController);
app.use("/theater",theaterController);
app.use("/event",eventController);
app.use("/eventCategory",eventCategoryController);
app.use("/vendor",vendorController);
app.use("/city",cityController);
app.use("/eventDetails/",EventDeatilsController);
app.use("/slideImage/",SlideImageController);
app.use("/userwallet/",UserWalletController);
app.use("/coupan/",CoupanCodeController);
app.use("/payment", paymentController);
const path = require('path');


 app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports=app;