import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

export default function CreateNewFile(props){
    const shortId = require('shortid');
    const navigation = useNavigate();
    const { fileType } = useParams();
    const [file, setFile] = useState({});
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState(fileType === 'html' ? `<!DOCTYPE html>
    <html>
        <head>
            <style></style>	
        </head>
        <body>
            Write you code here!
        </body>
    </html>` : '');

    useEffect(() => {
        if(Object.keys(file).length === 0) return;
        props.renderNewFile((prev) => [...prev, file]);
        let prevFiles = JSON.parse(localStorage.getItem('files')),
            prevFilesId = prevFiles.map(e => e.fileId);
            if(!prevFilesId.includes(file.fileId)){
                localStorage.setItem('files', JSON.stringify([...prevFiles, file]));
            }
            navigation('/notepad')            
    }, [file])

    function addItem(){
        if(fileName.length === 0) {
            return alert('Name of the file!');
        }
        let fileData = {
            'fileName': validateFilName(fileName),
            fileContent,
            'fileId': shortId.generate(),
            'createdDate': Date.now(),
            fileType,
            'fileColor': '',
            'fileFont': 'Inter'
        }
        setFile(() => ({...fileData}));

    }

    function validateFilName(fileName){        
        let totalLengthOfSameFiles = 0;
        for(let file of props.files){
            if(file.fileName.includes(fileName)) totalLengthOfSameFiles ++;
        }

        return fileName + ( totalLengthOfSameFiles ?  ' (' + totalLengthOfSameFiles + ')' : '');
    }

    function NameinputHandler(e){
        setFileName(() => e.target.value);
    }
    function ContentinputHandler(e){
        setFileContent(() => e.target.value);
    }

    return(
        <div className="create_content-container">
            <header className="navigation-part">
                <Link  to = '/notepad' className = 'main-button-container'>
                    <button className = 'go-to__main-menu-button'>&lt; Back</button>
                </Link>
            </header>
            <main className="create-container">
                <form className="create-file_data-container">
                    <label htmlFor="fileName" className="file-name-container">File Name</label>
                    <input type="text" value = {fileName} onChange = {(e) => NameinputHandler(e)} placeholder = 'File name' id = 'fileName' className = 'file-name-field' />
                    <label htmlFor="fileDesc" className="file_content-container">File Content</label>
                    <textarea name="file-desc" onChange = {(e) => ContentinputHandler(e)}  value = {fileContent} id="" cols="30" rows="10" id = 'fileDesc' className = 'file-content'></textarea>
                </form>
                    <button className='save-changes_button create-part' onClick = {() => addItem()}>
                        <i className="bi bi-pencil edit-pen-icon"></i>
                    </button>
            </main>
        </div>
    )
}