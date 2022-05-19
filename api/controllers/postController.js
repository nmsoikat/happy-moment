const Post = require('../models/Post')
const User = require('../models/User')

// create a post
exports.postCreateOne = async (req, res) => {
  try {
    const newPost = new Post(req.body)
    const savePost = await newPost.save();
    res.status(200).json(savePost)
  } catch (err) {
    res.status(500).json(err)
  }
}


// update a post
exports.postUpdateById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The post has been updated");
    } else {
      res.status(403).json('You can update only our post')
    }
  } catch (err) {
    res.status(500).json(err)
  }

}

// update a postType
exports.postTypeUpdateById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ postType: req.body.postType });
      res.status(200).json("The post type has been updated");
    } else {
      res.status(403).json('You can update only our post')
    }
  } catch (err) {
    res.status(500).json(err)
  }

}


// delete a post
exports.postDeleteById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne()
      res.status(200).json('post has been deleted');
    } else {
      res.status(403).json('You can delete only our post')
    }
  } catch (err) {
    res.status(500).json(err)
  }
}


// like //dislike a post
exports.postLikeById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json('The post has been liked');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json('The post has been disliked');
    }
  } catch (err) {
    res.status(500).json(err)
  }
}


// get a post
exports.postGetById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err)
  }
}


// get timelines posts
exports.postGetForTimeline = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = 1
  const skip = (page - 1) * limit; // previous-page * limit

  try {
    const currentUser = await User.findById(req.params.userId);
    // get 3 post for current user
    const posts = await Post.find({ userId: currentUser._id, postType: { $ne: 'private' } }).skip((page - 1) * 3).limit(3).sort('-createdAt');

    // get 1 post of each friends
    const friendsPosts = await Promise.all(
      currentUser.friends.map((friendId) => {
        return Post.find({ userId: friendId, postType: { $ne: 'private' } }).skip(skip).limit(limit).sort('-createdAt');
      })
    )

    res.status(200).json(posts.concat(...friendsPosts))

  } catch (err) {
    res.status(500).json(err)
  }
}

// get timelines posts
exports.postGetForTimelineOnlyVideos = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = 1
  const skip = (page - 1) * limit; // previous-page * limit

  try {
    const currentUser = await User.findById(req.params.userId);
    // get 3 post for current user
    const posts = await Post.find({ userId: currentUser._id, postType: { $ne: 'private' }, video: { $ne: null } }).skip((page - 1) * 3).limit(3).sort('-createdAt');

    // get 1 post of each friends
    const friendsPosts = await Promise.all(
      currentUser.friends.map((friendId) => {
        return Post.find({ userId: friendId, postType: { $ne: 'private' }, videos: { $ne: '' } }).skip(skip).limit(limit).sort('-createdAt');
      })
    )

    res.status(200).json(posts.concat(...friendsPosts))

  } catch (err) {
    res.status(500).json(err)
  }
}

// get timelines posts
exports.postGetForTimelineTrending = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = 3
  const skip = (page - 1) * limit; // previous-page * limit

  try {
    // const currentUser = await User.findById(req.params.userId);
    // get 3 post for current user
    const posts = await Post.find({likes:{$size: 1}}).skip(skip).limit(limit).sort('-createdAt');

    // get 1 post of each friends
    // const friendsPosts = await Promise.all(
    //   currentUser.friends.map((friendId) => {
    //     return Post.find({ userId: friendId, postType: { $ne: 'private' }, videos: { $ne: '' } }).skip(skip).limit(limit).sort('-createdAt');
    //   })
    // )
    // res.status(200).json(posts.concat(...friendsPosts))


    res.status(200).json(posts)


  } catch (err) {
    res.status(500).json(err)
  }
}

// get user's all posts
exports.postGetByUsername = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = 3
  const skip = (page - 1) * limit; // previous-page * limit

  const loggedInUser = req.user;
  try {
    const user = await User.findOne({ username: req.params.username })
    const posts = loggedInUser._id.toString() === user._id.toString() ?
      await Post.find({ userId: user._id }).skip(skip).limit(limit).sort('-createdAt') :
      await Post.find({ userId: user._id, postType: { $ne: 'private' } }).skip(skip).limit(limit).sort('-createdAt');

    console.log(posts);
    res.status(200).json(posts)

  } catch (err) {
    res.status(500).json(err)
  }
}