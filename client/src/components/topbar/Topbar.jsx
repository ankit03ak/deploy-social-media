import './topbar.css'
import { FaSearch } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import {Link} from "react-router-dom"
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';


export default function Topbar() {

    const {user} = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    
    
    const handleLogout = () => {
            // const cnf = prompt("You have logged out successfully.");
            // if(cnf === "yes" || cnf === "Yes" || cnf === "YES"){
                localStorage.removeItem("user");
                window.location.href = "/login";
                // alert("You have logged out successfully");
            // }
        // else{

        //     alert("User is still logged in");
        // }
    }; 


  return (
    <div className='topbarContainer'>
        <div className='topbarLeft'>
            <Link to="/" style={{textDecoration:"none"}}>
            <span className='logo'> 𝓢𝓸𝓬𝓲𝓸-𝓩𝓸𝓷𝓮</span>
            </Link>
        </div>
        <div className='topbarCenter'>
            <div className="searchbar">
                <FaSearch className='searchIcon' />
                <input placeholder='Search for friend, post or video' className='searchInput' />
            </div>
        </div>
        <div className='topbarRight'>
            <div className="topbarLinks">
            <Link to={"/"} className="no-link-style">
            {/* <Link to={`/profile/${user?.username}`} className="no-link-style"> */}
                <span className='topbarLink'>Homepage</span>
                </Link>
            <Link to={`/profile/${user?.username}`} className="no-link-style">

                <span className='topbarLink'>Timeline</span>
                </Link>

            </div>
            <div className="topbarIcons">
                <div className="topbarIconItem">
                    <IoMdPerson className='badge'/>
                    <span className="topbarIconBadge">1</span>
                </div>
                <div className="topbarIconItem">
                <Link to="/messenger" className="no-link-style">
                    <IoChatboxOutline className='badge' />
                    <span className="topbarIconBadge">3</span>
                    </Link>
                </div>
                <div className="topbarIconItem">
                    <IoMdNotifications className='badge'/>
                    <span className="topbarIconBadge">1</span>
                </div>
            </div>
            <Link to={`/profile/${user?.username}`}>
            <img 
            src={
                user?.profilePicture ? PF + user?.profilePicture : PF + "user/Blank-Avatar.png"
            } 
            alt="" className="topbarImg" />
            </Link>
            <button className="logoutBtn disabled" onClick={handleLogout}> 
                <h4>Logout</h4>
                </button>
        </div>

    </div>
  )
}
