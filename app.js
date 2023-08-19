/* The code is importing three modules in JavaScript: `express`, `ejs`, and `body-parser`. */
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import passportLocalMongoose from 'passport-local-mongoose';


/* `const app=express();` creates an instance of the Express application. This instance is stored in
the constant variable `app`, which is used to configure and run the server. */
const app=express();
const port=3000;


/* `app.set('view engine','ejs');` sets the view engine for the Express application to EJS. This means
that when rendering views, Express will use the EJS templating engine to generate HTML. */
app.set('view engine','ejs');
/* `app.use(express.static("./public"))` is a middleware function in Express.js that serves static
files from the specified directory. In this case, it is serving static files from the "public"
directory. This means that any files in the "public" directory, such as CSS files or images, can be
accessed by the client. */
app.use(express.static("./public"));
/* `app.use(bodyParser.urlencoded({extended:true}));` is a middleware function in Express.js that
parses incoming requests with URL-encoded payloads. */
app.use(bodyParser.urlencoded({extended:true}));


/* The `app.use(session({ ... }))` code is configuring the Express application to use sessions. */
app.use(session({
    secret:"our little secret",
    resave:false,
    saveUninitialized:false
}));

/* `app.use(passport.initialize())` initializes the Passport authentication middleware. Passport is an
authentication middleware for Node.js that provides a simple and modular way to authenticate
requests. This line of code initializes Passport and prepares it to be used in the application. */
app.use(passport.initialize());
/* `app.use(passport.session());` is configuring the Express application to use Passport's session
middleware. This middleware is responsible for managing user sessions and persisting user
authentication state across multiple requests. */
app.use(passport.session());

/* The code is using the Mongoose library to connect to a MongoDB database. */
mongoose.connect("mongodb://127.0.0.1:27017/blogPostsDB");




/* The code `const userSchema= mongoose.Schema({ email:String, password:String })` is defining a schema
for a user in the MongoDB database. The schema specifies the structure and data types of the user
object. In this case, the user schema has two properties: `email` and `password`, both of which are
of type String. This schema will be used to create a model for the user collection in the database. */
const userSchema= mongoose.Schema({
    email:String,
    password:String
})

/* `userSchema.plugin(passportLocalMongoose);` is adding the `passport-local-mongoose` plugin to the
`userSchema`. */
userSchema.plugin(passportLocalMongoose);

/* `const User=mongoose.model('user',userSchema);` is creating a model for the user schema defined
earlier. */
const User=mongoose.model('user',userSchema);



/* `passport.use(User.createStrategy())` is configuring Passport to use the `createStrategy()` method
provided by the `passport-local-mongoose` plugin for the User model. */
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

/* `const postSchema= mongoose.Schema({ Title:String, Data:String });` is defining a schema for a blog
post in the MongoDB database. */
const postSchema= mongoose.Schema({
    Title:String,
    Data:String
});

/* `const BlogPost=new mongoose.model('post',postSchema);` is creating a model for the blog post schema
defined earlier. */
const BlogPost=new mongoose.model('post',postSchema);



/* This code snippet is defining a route handler for the root URL ("/"). When a GET request is made to
the root URL, the handler function is executed. */
app.get("/",async (req,res)=>{
    const allPosts=await BlogPost.find();
    res.render("home",{
        Posts:allPosts
    })
});

app.get("/about",(req,res)=>{
    res.render("about")
})

app.get("/register",(req,res)=>{
    res.render("register")
});

app.post("/register",(req,res)=>{
    console.log(req.body)
    User.register({username:req.body.username},req.body.password ,function(err){
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate('local')(req,res,function(){
                res.redirect("/")
            })
        }
    })
      
});

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",(req,res)=>{
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });
    req.logIn(user,function(err){
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/createPost");
            })
        }
    })
})

app.get("/logout",(req,res)=>{
    req.logOut(function(err){
        if(err) console.log(err);
        res.redirect("/");
    })
})

app.get("/createPost",(req,res)=>{
    res.render("compose")
});


app.post("/compose",(req,res)=>{
    console.log(req.body);
    const newPost=new BlogPost({
        Title:req.body.posttitle,
        Data:req.body.postData
    })
    console.log(newPost);
    newPost.save();
    res.redirect("/")
});





/* `app.listen(port,()=>{...})` is a method in Express.js that starts a server and listens for incoming
requests on the specified port. In this case, it is listening on port 3000. When the server starts
running, it will log a message to the console saying "app is running on 3000". */
app.listen(port,()=>{
    console.log(`app is running on ${port}`);
})


