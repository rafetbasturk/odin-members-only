const Post = require("../models/postModel");
const async = require("async");
const { body, validationResult } = require("express-validator");

const posts_index = (req, res, next) => {
  async.parallel(
    {
      posts(cb) {
        Post.find().sort({ updatedAt: -1 }).populate("authorInfo").exec(cb)
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      const mapped = results.posts.map(item => {
        const itemId = item?._id.toString()
        const authorId = item.authorInfo?._id.toString()
        const { title, post, datetime, authorInfo: { fname, lname } } = item
        return req.user ? { itemId, title, post, datetime, author: { authorId, fname, lname } } : { post, title }
      })

      res.render('posts/index', {
        title: 'All Posts',
        user: req.user || false,
        posts: mapped,
      })
    }
  )
}

const posts_create_get = (req, res) => {
  res.render("posts/create", {
    title: "Create new post",
    user: req.user,
    post: {},
    errors: {},
  })
}

const posts_create_post = [
  body("title", "Title is required and should be at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("post", "Post is required and should be at least 3 characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("posts/create", {
        title: "Create new post",
        post: req.body,
        user: req.user ? true : false,
        errors: errors.array()
      });
      return
    }

    const newPost = new Post({
      ...req.body,
      authorInfo: req.user._id
    })

    newPost.save(err => {
      if (err) {
        return next(err)
      }
      res.redirect("/posts")
    })
  }
]

const post_delete_get = (req, res, next) => {
  async.parallel(
    {
      post(callback) {
        Post.findById(req.params.id).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("posts/delete", {
        title: "Delete Post",
        post: results.post,
        user: req.user
      });
    }
  );
};

const post_delete_post = (req, res, next) => {
  Post.findByIdAndRemove(req.body.postId, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/posts");
  });
};

module.exports = {
  posts_index,
  posts_create_get,
  posts_create_post,
  post_delete_get,
  post_delete_post
}