import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Topbar from "../../components/topbar/Topbar";
import './home.css'

export default function Home() {
  return (
    <div>
        <Topbar />
        <div className="homeContainer">

        <Feed />
        <Rightbar />

        </div>
    </div>
  )
}
