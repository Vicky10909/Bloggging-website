import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

let blogs = [];

// mount middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("main.ejs");
})

// create post
app.get("/create", (req, res) => {
    res.render("create.ejs");
})

// view the titles
app.get("/view", (req, res) => {
    res.render("view.ejs", {blogs: blogs});
})

// view details of chosen blog
app.get("/view/:id", (req, res) => {
    const id = req.params.id;
    const currentBlog = blogs.find((post) => post.id == id);
    if (currentBlog) {
        res.render("continueReading.ejs", {blog: currentBlog}); // render edit ejs
    } else {
        res.status(404).send("Blog doesn't exsist");
    }
});

// edit blog
app.get("/edit/:id", (req, res) => { // Change the route to listen for POST requests
    const id = req.params.id;
    const currentEditBlog = blogs.find((blog) => blog.id == id);
    if (currentEditBlog) {
        res.render("edit.ejs", {blog: currentEditBlog}); // render edit ejs
    } else {
        res.status(404).send("Blog cannot be edited");
    }
});

app.post("/submit", (req, res) => {
    const blogTitle = req.body.title;
    const blogContent = req.body.content;
    const blog = { title: blogTitle, content: blogContent, id: Math.floor(Math.random() * 100) };

    blogs.push(blog);
    res.render("submit.ejs", {blog: blog});
})

// edit chosen blog
app.post("/submit/:id", (req, res) => {
    const currentSubmitBlog = blogs.find(blog => blog.id == req.params.id);
    currentSubmitBlog.title = req.body.title;
    currentSubmitBlog.content = req.body.content;
    res.render("submit.ejs", {blog: currentSubmitBlog})

    console.log(blogs)
})

// delete chosen blog
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    blogs = blogs.filter(blog => blog.id != id);
    console.log(blogs);
    res.render("view.ejs", { blogs: blogs });
})


app.listen(port, () => {
    console.log(`This app is listening on port ${port}`);
})