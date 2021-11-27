import { useState, useEffect } from 'react';
import { Link, useParams} from 'react-router-dom'

export default function EditNotepadHTMLFile(props){
    const { id } = useParams();
    const files = props.files;
    let currentFile = files.filter(e => e.fileId === id)[0],
    storageFiles = JSON.parse(localStorage.getItem('files'));

    const [fileContent, setFileContent] = useState(currentFile.fileContent);

    useEffect(() => {
        props.setFiles( prev => {
            for(let f of prev){
                if(f.fileId === id){
                    if(fileContent !== f.fileContent){
                        f.createdDate = Date.now();
                        f.fileContent = fileContent;
                    }
                }
          }
            return prev;
        })
        localStorage.setItem('files', JSON.stringify(props.files));
    })

    return(
        <div className="edit-container">
            {storageFiles.length === 0 ? window.location.href = '/notepad' : ''}
            <header className="navigation-part">
                <Link  to = '/notepad' className = 'main-button-container'>
                    <button className = 'go-to__main-menu-button'>&lt; Back</button>
                </Link>
                <h1 className = 'notepad-title'>{currentFile.fileName}</h1>
            </header>
            <main className="editor-container">
                    <textarea 
                        name="file-content" 
                        id="1d2" 
                        cols="30" 
                        rows="10" 
                        className = 'file-content-field' 
                        onKeyDown = {(e) => {props.onKeyEvent(e); setFileContent(() => e.target.value)}}
                        value = {fileContent}
                        onChange = {(e) => setFileContent(() => e.target.value)}
                        >
                            
                        </textarea>
                <button className='save-changes_button'>
                    <i className="bi bi-pencil edit-pen-icon"></i>
                </button>
            </main>
        </div>
    )
}