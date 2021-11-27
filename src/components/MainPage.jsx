import { Link } from 'react-router-dom'

export default function MainPage(){
    return(
        <div className="main-page-container">
            <h1 className="main-page-title">Welcome to the online notepad</h1>
            <svg className = 'main-page-file-icon' width="341" height="341" viewBox="0 0 341 341" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M198.917 28.4167H85.25C77.7134 28.4167 70.4855 31.4106 65.1564 36.7398C59.8272 42.069 56.8333 49.2968 56.8333 56.8334V284.167C56.8333 291.703 59.8272 298.931 65.1564 304.26C70.4855 309.59 77.7134 312.583 85.25 312.583H255.75C263.287 312.583 270.514 309.59 275.844 304.26C281.173 298.931 284.167 291.703 284.167 284.167V113.667L198.917 28.4167Z" fill="#16C79A"/>
<path d="M198.917 28.4167V103.667C198.917 109.19 203.394 113.667 208.917 113.667H284.167" fill="#EBEBEB"/>
</svg>
            <Link to = '/notepad'>
                <button className="go-to__notepad-button">
                    Continue
                </button>
            </Link>
        </div>
    )
}