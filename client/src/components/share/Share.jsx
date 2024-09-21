import { useContext, useRef, useState } from "react";
import "./share.css";
import { 
           MdPermMedia, 
         MdLabel, 
         MdEmojiEmotions,
         MdOutlineRoom,
         MdOutlineCancel
        } 
        from 'react-icons/md';

import {AuthContext} from "../../context/AuthContext";
import axios from "axios";




export default function Share() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) =>{
      e.preventDefault();
      const newPost = {
          userId: user._id,
        desc: desc.current.value,
      }
      // console.log(newPost.userId)

      if(file){
          const data = new FormData();
          data.append("file",file)
  
          try {
             const img = await axios.post("/upload", data);
             const fileName = img.data.fileName
             newPost.img = fileName;
    
             const res= await axios.post("/posts", newPost);
              window.location.reload();
    
        } catch (error) {
            console.error("Upload and post Error:", error.response ? error.response.data : error.message);
          }
        }
        else {
            try {
                const postRes = await axios.post("http://localhost:8800/api/posts", newPost);
                console.log("Post response:", postRes.data); // Log the response
                window.location.reload();
              } catch (error) {
                  console.log("Error during post creation:", error);
                }
        }
                // try {
                  //  const res= await axios.post("/posts", newPost);
                  //   // window.location.reload();
                  //   console.log(res.data);
          
                  // } catch (error) {
                    //   console.error("Post Error:", error.response ? error.response.data : error.message);
                    // }
            
            
                }
            

  return (
      <div className="share">
        <div className="shareWrapper">
          <div className="shareTop">
            <img className="shareProfileImg" src={ user.profilePicture ? PF+user.profilePicture : PF + "user/Blank-Avatar.png"} alt="" />
            <input
            ref={desc}
              placeholder={"What's in your mind " +user.username + "?"}
              className="shareInput"
            />
          </div>
          <hr className="shareHr"/>
          {file && (
            <div className="shareImgContainer">
              <img
               className="shareImg" 
               src={URL.createObjectURL(file)} alt="" />
              <MdOutlineCancel className="shareCancelImg" onClick={()=>{setFile(null)}}/>
            </div>
          )}
          <form className="shareBottom" onSubmit={submitHandler}>
              <div className="shareOptions">
                  <label htmlFor="file" className="shareOption">
                      <MdPermMedia color="tomato" className="shareIcon"/>
                      <span className="shareOptionText">Photo or Video</span>
                      <input style={{display:"none"}} type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e) => setFile(e.target.files[0])}/>
                  </label>
                  <div className="shareOption">
                      <MdLabel color="blue" className="shareIcon"/>
                      <span className="shareOptionText">Tag</span>
                  </div>
                  <div className="shareOption">
                      <MdOutlineRoom color="green" className="shareIcon"/>
                      <span className="shareOptionText">Location</span>
                  </div>
                  <div className="shareOption">
                      <MdEmojiEmotions color="goldenrod" className="shareIcon"/>
                      <span className="shareOptionText">Feelings</span>
                  </div>
              </div>
              <button className="shareButton" type="submit">Share</button>
          </form>
        </div>
      </div>
    );
  }
  
 












// import React, { useState } from "react";
// import "./share.css";
// import {
//   MdOutlinePermMedia,
//   MdOutlineLabelImportant,
//   MdEmojiEmotions,
//   MdCancel,
// } from "react-icons/md";
// import { FaLocationDot } from "react-icons/fa6";
// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import axios from "axios";

// export default function Share() {
//   const PF = process.env.REACT_APP_PUBLIC_FOLDER;
//   const [file, setFile] = useState(null);
//   const [desc, setDesc] = useState("");
//   const { user } = useContext(AuthContext);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     const newPost = {
//       userId: user._id, 
//       desc: desc,
//     };
//     if (desc.length < 10) {
//       alert("Description must be at least 15 characters long.");
//       return;
//     }

//     if (file) {
//       const data = new FormData();
//       data.append("file", file);

//       try {
//         const uploadRes = await axios.post("https://real-time-social-media-4.onrender.com/api/upload", data);
//         const fileName = uploadRes.data.fileName; // Get filename from response
//         newPost.img = fileName;

//         await axios.post("https://real-time-social-media-4.onrender.com/api/posts", newPost);
//         window.location.reload();
//       } catch (error) {
//         console.log(`Error during file upload or post creation: ${error}`);
//       }
//     } else {
//       try {
//         const postRes = await axios.post("https://real-time-social-media-4.onrender.com/api/posts", newPost);
//         console.log("Post response:", postRes.data); // Log the response
//         window.location.reload();
//       } catch (error) {
//         console.log("Error during post creation:", error);
//       }
//     }
//   };

//   return (
//     <div className="share">
//       <div className="shareWrapper">
//         <div className="shareTop">
//           <img src="assets/user/user1.jpg" alt="" className="shareProfileImg" />
//           <input 
//             placeholder={`What's in your mind`} 
//             className="shareInput" 
//             value={desc} 
//             onChange={(e) => setDesc(e.target.value)} 
//            minLength={10}
//           />
//         </div>
//         <hr className="shareHr" />
// {file && (
//   <div className="shareImgContainer">
//     <img className="shareImg" alt="" src={URL.createObjectURL(file)} />
//     <MdCancel className="shareCancelImg" onClick={()=>setFile(null)}/>
//   </div>
// )}
//         <form className="shareBottom" onSubmit={submitHandler}>
//           <div className="shareOptions">
//             <label htmlFor="file" className="shareOption">
//               <MdOutlinePermMedia style={{ color: "#EC3B36" }} className="shareIcon" />
//               <span className="shareOptionText">Photo or Video</span>
//               <input
//                 type="file"
//                 name="file"
//                 id="file"
//                 style={{ display: "none" }}
//                 accept=".png,.jpeg,.jpg"
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//             </label>
//             <div className="shareOption">
//               <MdOutlineLabelImportant style={{ color: "blue" }} className="shareIcon" />
//               <span className="shareOptionText">Tag</span>
//             </div>
//             <div className="shareOption">
//               <FaLocationDot style={{ color: "green" }} className="shareIcon" />
//               <span className="shareOptionText">Location</span>
//             </div>
//             <div className="shareOption">
//               <MdEmojiEmotions style={{ color: "goldenrod" }} className="shareIcon" />
//               <span className="shareOptionText">Feelings</span>
//             </div>
//           </div>
//           <button className="shareButton" type="submit" disabled={!file && !desc}>
//             Share
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }