var express = require('express');
var router = express.Router();

const {
  posts_index,
  posts_create_get,
  posts_create_post,
  post_delete_get,
  post_delete_post
} = require("../controllers/postsController")

router.get('/', posts_index);

router.route('/create')
  .get(posts_create_get)
  .post(posts_create_post)

router.route("/:id/delete")
  .get(post_delete_get)
  .post(post_delete_post)

module.exports = router;
