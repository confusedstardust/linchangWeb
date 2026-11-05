import {createRoot} from "react-dom/client";
import ClassroomSoundMeter from "../components/classroom-sound-meter";
import "../styles/base.css";
import "../styles/sound-meter.css";
createRoot(document.getElementById("root")!).render(<ClassroomSoundMeter/>);
