import express from "express"
import path from "path"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import Blog from "./models/blog.js"

import userRoute from "./routes/user.js"
import blogRoute from "./routes/blog.js"
import { checkForAuthenticationCookie } from "./middlewares/authentcation.js"


const app = express()
const PORT = 8000

mongoose.connect("mongodb://127.0.0.1:27017/blogify")
.then((e)=> console.log("MongoDB Connected"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static(path.resolve("./public")))

console.log(path.resolve("./public"))

app.use(checkForAuthenticationCookie("token"))


app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.get("/", async(req,res)=>{
    const allBlogs = await Blog.find({}).sort({"createdAt":-1})
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    })
})

app.use("/user", userRoute)
app.use("/blog", blogRoute)

app.listen(PORT, ()=> console.log(`Server started at ${PORT}`))
