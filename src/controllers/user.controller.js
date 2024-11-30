const express = require('express');
const User=require('../models/user.model');
const UserWallet =require('../models/userWallet.model')
const jwt = require('jsonwebtoken');
const  bcrypt =require('bcryptjs');

const router = express.Router();



router.get('/',async (req,res)=>{
    const users = await User.find({});
    res.send(users);
})

// api to check the admin role for admin dashboard
router.post('/checkrole',async (req,res)=>{
    const { email } = req.body;
    try {
        // Find user by email and only select the 'role' field
        const user = await User.findOne({ email }).select('role');
        console.log(user);
        const userObject = user.toObject();
        if (user && userObject.role == 'admin') {
            return res.status(200).json({ message: "admin" });
        } else {
            console.log('Unauthorized User');
            return res.status(200).json({ message: "Unauthorized User" });
        }
    } catch (error) {
        console.error('Error fetching user role:', error);
        return res.status(500).json({ message: "Server Error" });
    }
    
    
   
})

router.post('/createUser', async (req, res) => {
    console.log("Request came:", req.body);

    const { firstname, lastname, email, password } = req.body; // Assume these are coming from Google OAuth
        console.log("request for login user body",req.body);
    try {
        // Check if user with the email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // If the user exists, respond with the existing user data (for login)
            return res.status(200).json({ message: "User already exists", user: existingUser });
        }

        let createdUser = await User.create(req.body);
        const userWallet = new UserWallet({
            user_id: createdUser._id,
            email: createdUser.email,
            name: createdUser.displayName,  // Assuming displayName exists in the User model
            balance: 0,  // Initialize balance to 0 or set a default value
        });

        // Save the UserWallet to the database
        await userWallet.save();

        // We create the user and then use the `.toObject()` method to remove unwanted fields
        let userResponse = createdUser.toObject();
        delete userResponse.displayName;  // remove the displayName field (or any other field)
        
        // Send the response without the `displayName`
        return res.status(201).json({ message: "User created successfully", user: userResponse });

    } catch (error) {
        // Handle any errors (e.g., database issues, validation errors)
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
});


router.post('/create', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    console.log("Request body: ", req.body);

    try {
        // Basic validation for required fields
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate email format using regex (simple check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Check if user with this email already exists
        const isUser = await User.findOne({ email: email });
        if (isUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Password hashing
        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);
        console.log("Hashed password: ", hashedPassword);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            firstname,
            lastname,
        });

        // Save the user
        const savedUser = await newUser.save();
        if (savedUser) {
            return res.status(201).json({ message: "User registration successful" });
        }

    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
});

router.post('/login',async(req,res)=>{
    console.log("request came",req.body);
    const { email , password } = req.body;

       try{
            if(email && password)
            {
                const isEmail = await User.findOne({email : email});
                if(isEmail){
                    if(isEmail.email=== email && (await bcrypt.compare(password,isEmail.password)) ){
                        
                        const user = await User.findOne({ email }).select('role');
                        if (user) {
                            console.log(`Role for user ${email}: ${user}`);
                        } else {
                        console.log('role not found');
                        }
    
                        
                        // generate Token
                        const token = jwt.sign({userID : isEmail._id},"Secreat key",{ expiresIn:"2d",});
                        return res.status(200).json({
                            message: "Login Successfully",
                            token,
                            name : isEmail.email,
                            
                        });
                    }
                    else{
                        return res.status(400).json({ message: "Wrong Credentials"});
                    }
                }
                else{
                    return res.status(400).json({ message: "Email ID not found"});
                }
            }
            else{
                return res.status(400).json({ message: "all fields are required"});
            }
       }
       catch (error){
        return res.status(400).json({ message: error.message});
    }
    }
)

module.exports= router;
