require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const app = express();

const stripe = require("stripe")(process.env.SECRET_KEY);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("js"));

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  age: {
    type: Number,
    required: true,
    unique: false,
  },
  interests: {
    type: String,
  },
  availability: {
    type: String,
  },
  message: {
    type: String,
  },
});

const user_collection = new mongoose.model("user_collection", schema);
mongoose
  .connect("mongodb://0.0.0.0:27017/myuserdata")
  .then(() => {
    console.log("Mongoose Connection success!!");
  })
  .catch((err) => {
    console.log(err);
  });

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Education for child" }],
  [2, { priceInCents: 10000, name: "Shelter for child" }],
  [3, { priceInCents: 10000, name: "Food for child" }],
]);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/Volunteer.html", function (req, res) {
  res.sendFile(__dirname + "/Volunteer.html");
});
app.get("/Donate.html", function (req, res) {
  res.sendFile(__dirname + "/Donate.html");
});
app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/create-checkout-session", async (req, res) => {
  //res.json({ url: "Hi" })
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.SERVER_URL}/sucesss.html`,
      cancel_url: `${process.env.SERVER_URL}/faill.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.post("/Volunteer.html", function (req, res) {
  let req_userdata = new user_collection(req.body);
  req_userdata.save();
  res.redirect("/success.html");
});
app.post("/success", function (req, res) {
  res.redirect("/");
});
app.post("/successs", function (req, res) {
  res.redirect("/");
});
app.post("/fail", function (req, res) {
  res.redirect("/");
});
app.post("/faill", function (req, res) {
  res.redirect("/");
});
app.listen(port, function () {
  console.log("Running");
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose")

// const app = express();

// app.use(bodyParser.json)
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(express.static('public'))

// mongoose.connect("mongodb://localhost:27017/registration_DB",{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// var db=mongoose.connection
// db.on('error',()=>console.log("Error"))
// db.once('open',()=>console.log("Connected"))

// app.post("/Volunteer",function(req,res){
//     var name= req.body.name;
//     var email=req.body.email;
//     var age=req.body.age;
//     var gender=req.body.gender;
//     var interests=req.body.interests;
//     var availability=req.body.availability;
//     var msg=req.body.msg;

//     var data={
//         "name":name,
//         "email":email,
//         "age":age,
//         "gender":gender,
//         "interests":interests,
//         "availability":availability,
//         "message":msg
//     }

//     db.collection('users').insertOne(data,function(err,collection){
//         if(err){
//             throw err;
//         }
//             console.log("Success!!");
//     })
//     res.redirect('home.html')
// })

// app.get("/Volunteer.html",function(req,res){
//      res.send("Hello")
//      res.redirect('home.html');
// });

// app.listen(3000,function(){
//     console.log("Server is running")
// })
// app.post("/Donate.html", async(req,res) => {
//     try{
//      const session = await stripe.checkout.sessions.create({
//          payment_method_types: ['card'],
//          mode: 'payment',
//          line_items: req.body.items.map(item => {
//             const storeItem= items.get(item.id)
//             return{
//                 price_data: {
//                     currency: 'rupees',
//                     unit_amount: storeItem.price
//                 },
//                 quantity: item.quantity
//             }
//          }),
//          success_url: '${process.env.SERVER_URL}/success.html',
//          cancel_url: '${process.env.SERVER_URL}/cancel.html'
//      })
//      res.json({url: session.url})
//     }
//     catch(e){
//         res.status(500).json({error: e.message})
//     }
// })
