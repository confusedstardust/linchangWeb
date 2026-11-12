import {createRoot} from "react-dom/client";
import ClassroomRewards from "../components/classroom-rewards";
import "../styles/base.css";
import "../styles/reward-studio.css";
createRoot(document.getElementById("root")!).render(<ClassroomRewards initialDate={new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Shanghai"}).format(new Date())}/>);
