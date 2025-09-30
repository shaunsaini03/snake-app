import { DIRS } from "../gameCore";
import { useEffect } from "react";

const HumanController = ({ onAction }) => {
    // Handle key presses for controlling the snake
    useEffect(() => {
        const handleKeyDown = (e) => {
        switch (e.key) {
            case "ArrowUp":
            onAction(DIRS.UP);
            break;
            case "ArrowDown":
            onAction(DIRS.DOWN);
            break;
            case "ArrowLeft":
            onAction(DIRS.LEFT);
            break;
            case "ArrowRight":
            onAction(DIRS.RIGHT);
            break;
            default:
            break;
        }
        };
    
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onAction]);
    
    return null;
    }

export default HumanController;