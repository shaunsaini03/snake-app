import { useNavigate } from "react-router-dom";

const HowToPlay = () => {

    const navigate = useNavigate()

    return (
        <div class="how-to-play-container">
            <h1>
                How to Play
            </h1>
            <div class="instructions">

            </div>


            <button onClick={() => navigate('/')}>
                Back
            </button>

        </div>
    )
}


export default HowToPlay;