/* The code is importing three modules in JavaScript: `express`, `ejs`, and `body-parser`. */
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";



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




app.get("/",(req,res)=>{
    res.render("home")
});

app.get("/about",(req,res)=>{
    res.render("about")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/createPost",(req,res)=>{
    res.render("compose")
})









/* `app.listen(port,()=>{...})` is a method in Express.js that starts a server and listens for incoming
requests on the specified port. In this case, it is listening on port 3000. When the server starts
running, it will log a message to the console saying "app is running on 3000". */
app.listen(port,()=>{
    console.log(`app is running on ${port}`);
})


