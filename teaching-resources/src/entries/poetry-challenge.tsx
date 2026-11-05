import {createRoot} from "react-dom/client";
import PoetryChallenge from "../components/poetry-challenge";
import "../styles/base.css";
import "../styles/poetry-challenge.css";
createRoot(document.getElementById("root")!).render(<PoetryChallenge/>);
