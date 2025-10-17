import "./post.css";
import { MdDelete, MdMoreVert } from "react-icons/md";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {format} from "timeago.js"
import {Link} from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { PF } from "../../config";

export default function Post({ post }) {

  
  
  
  
  const [like,setLike] = useState(post.likes.length)
  const [isLiked,setIsLiked] = useState(false)
  const [user,setUser] = useState({})
  // const [namee, setNamme] = useState();
  
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user:currentUser } = useContext(AuthContext)

  useEffect( () => {
    setIsLiked(post?.likes.includes(currentUser?._id))
  }, [currentUser?._id, post.likes])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://deploy-social-media-ap1.onrender.com/api/users?userId=${post.userId}`);
        setUser(res.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = async ()=>{
    try {
      await axios.put("https://deploy-social-media-ap1.onrender.com/api/posts/" + post._id + "/like", {userId : currentUser._id} ) 
    } catch (error) {
      console.log(error.message)
    }
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
  }



  
  const deletePost = async (postId, userId) => {
  try {
    await axios.delete(`https://deploy-social-media-ap1.onrender.com/api/posts/${postId}`, {
      data: { userId: userId }, // send userId in request body
    });
    toast.success("Post deleted successfully!");
    setTimeout(() => window.location.reload(), 500);
    // Option 1: reload page
    // setTimeout(() => window.location.reload(), 1000);
    // Option 2: update state instead of full reload
    // setPosts((prev) => prev.filter(post => post._id !== postId));
  } catch (error) {
    console.error("Delete post error:", error.response ? error.response.data : error.message);
    toast.error("Failed to delete post.");
  }
};

  const showNotDelete = () => {
    toast.info("You can delete only your post");
  };



  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
            <img
  className="postProfileImg"
  src={PF(user.profilePicture) || PF("user/Blank-Avatar.png")}
  alt=""
/>
              </Link>
            <span className="postUsername">
              {user.username}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
<div className="postTopRight">
  {post.userId === currentUser._id ? (
    <MdDelete
      className="deleteIcon"
      onClick={() => {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (confirmed) {
          deletePost(post._id, currentUser._id);
        }
      }}
    />
  ) : (
    <div onClick={showNotDelete}>
      <MdMoreVert className="deleteIcon" />
    </div>
  )}
</div>

        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span> 
          <img className="postImg" src={(post && post.img) ? post.img : ""} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
<img className="likeIcon" src={PF("like.png")} onClick={likeHandler} alt="" />
<img className="likeIcon" src={PF("heart.png")} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{like} Likes </span>
          </div>
          <div className="postBottomRight">
          </div>
        </div>
      </div>
    </div>
  );
}

