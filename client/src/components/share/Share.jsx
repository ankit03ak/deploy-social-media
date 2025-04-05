import { useContext, useState } from "react";
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

export default function Share() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
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
        window.location.reload();
      } catch (error) {
        console.error("Upload and post Error:", error.response ? error.response.data : error.message);
      }
    } else {
      try {
        await axios.post("https://deploy-social-media-ap1.onrender.com/api/posts", newPost);
        window.location.reload();
      } catch (error) {
        console.log("Error during post creation:", error);
      }
    }
  };

  const handleEmojiSelect = (emoji) => {
    setDesc((prevDesc) => prevDesc + emoji.native);
  };

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
            <div className="emojiPicker">
              <Picker data={emojiData} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
          <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  );
}
