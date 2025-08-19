import { useContext, useEffect, useRef, useState } from "react";
import "./share.css";
import { 
  MdPermMedia, 
  MdEmojiEmotions,
  MdOutlineCancel
} from 'react-icons/md';

import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { toast } from "react-toastify";

export default function Share() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();
      if (!desc.trim() && !file) {
    toast.error("Please write something or add a photo/video before posting!");
    return;
  }
    const newPost = {
      userId: user._id,
      desc: desc,
    };

    if (file) {
      const data = new FormData();
      data.append("file", file);
      try {
        const img = await axios.post("https://deploy-social-media-ap1.onrender.com/api/upload", data);
        newPost.img = img.data.fileName;

        await axios.post("https://deploy-social-media-ap1.onrender.com/api/posts", newPost);
        toast.success("Post uploaded successfully!");
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error("Upload and post Error:", error.response ? error.response.data : error.message);
        toast.error("Failed to upload post. Please try again.");
      }
    } else {
      try {
        await axios.post("https://deploy-social-media-ap1.onrender.com/api/posts", newPost);
        toast.success("Post created successfully!");
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.log("Error during post creation:", error);
        toast.error("Failed to create post. Please try again.");
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    setDesc((prevDesc) => prevDesc + emoji.native);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "user/Blank-Avatar.png"} alt="" />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={"What's on your mind " + user.username + "?"}
            className="shareInput"
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <MdOutlineCancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <MdPermMedia color="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input style={{ display: "none" }} type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])} />
            </label>

            <div className="shareOption" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <MdEmojiEmotions color="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          {showEmojiPicker && (
            <div className="emojiPicker" ref={emojiRef}>
              <Picker data={emojiData} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
          <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  );
}
