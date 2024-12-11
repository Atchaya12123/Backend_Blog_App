import express, { urlencoded } from "express"
import multer from "multer"
import path from "path"
import Blog from "../models/blog.js";



const router = express.Router();

router.use(express.static(path.resolve("./public")))
console.log(path.resolve("./public"))
// const app = express()
console.log(path.resolve("./public"))
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("./public/uploads"))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()} - ${file.originalname}`;
      cb(null,fileName)
    }
  });


  
  const upload = multer({ storage: storage })



  router.get("/add-new", (req,res)=>{
    return res.render("addBlog",{
        user: req.user,
    })
})

router.get("/:id", async (req,res)=>{
  const oneBlog = await Blog.findById(req.params.id);
  //console.log(oneBlog);
  return res.render("blogPage", {
      user: req.user,
      blogOne: oneBlog,
    })
  })



router.post("/",upload.single("coverImage"), async (req,res)=>{
    //console.log(req.body. req.file)
    const {title,body} = req.body;
    const blog = await Blog.create({
       title,
       body,
       createdBy: req.user._id,
       coverImageURL: `uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})



export default router;