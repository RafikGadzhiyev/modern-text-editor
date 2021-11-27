export default function DownloadFileBlock(props){

    function clickHandler(e){
        let fileId = props.fileId,
            currentElement = e.target,
            fileType = currentElement.dataset.type;
            props.downloadHandler(e, fileId, fileType);
    }

    return(
        <div className="download-wrapper">
            <div className="download-container">
                <button 
                    className = 'close-dw_block-button'
                    onClick = {() => props.setIsDw(() => false)}
                >
                    <i className="bi bi-x close-icon"></i>
                </button>
                <header className="dw-header-part">
                    <h1 className = 'dw-title'>Download as:</h1>
                </header>
                <main className="dw-main-container">
                    <div className="txt-file-container dw-file-container">
                        <header className="title-container txt">
                            <h2 className = 'txt-title'>.TXT file</h2>
                        </header>
                        <main className="txt-container main_dw-content-container">
                            <a 
                                href = '#'
                                className = 'dw-txt_button dw_file-button'
                                data-type = 'text'
                                onClick = {(e) => clickHandler(e)}
                            >
                                Download .txt
                            </a>
                        </main>
                    </div>
                    <div className="msWord-container dw-file-container">
                        <header className="title-container">
                            <h2 className = 'msWord-title'>.DOCX file</h2>
                        </header>
                        <main className="msWord-container main_dw-content-container">
                            <a 
                                href ='#'
                                className = 'dw-msWord_button dw_file-button'
                                data-type = 'word'
                                onClick = {(e) => clickHandler(e)}
                            >
                                Download .docx
                            </a>
                        </main>
                    </div>
                </main>
            </div>
        </div>
    )
}