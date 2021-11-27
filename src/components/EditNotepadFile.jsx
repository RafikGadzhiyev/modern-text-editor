import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function EditNotepadFile(props){
    const { id } = useParams();
    const navigation = useNavigate();
    const files = props.files;
    let storageFiles = JSON.parse(localStorage.getItem('files')) || [];
    let currentFile = files.filter(e => e.fileId === id)[0];
    
    const [fileContent, setFileContent] = useState(currentFile.fileContent);
    const [fileFont, setFileFont] = useState (currentFile.fileFont); 
    const [tmpFileContent, setTmpFileContent] = useState(fileContent);
    let selectedText = '',
        start, 
        end;
    
    useEffect(() => {
        
        if(currentFile.fileColor.length === 4 || currentFile.fileColor.length === 7){
            let previewContainer = document.querySelector('.file-content-field'),
                dropIcon = document.querySelector('.fill-icon'),
                colorInput = document.querySelector('.font-color-field');
            dropIcon.style.color = colorInput.style.color = currentFile.fileColor;
            previewContainer.style.setProperty('color', currentFile.fileColor, 'important');
            colorInput.value = currentFile.fileColor;
        }

        props.setFiles( prev => {
            for(let f of prev){
                if(f.fileId === id){
                    if(fileContent !== f.fileContent){
                        f.createdDate = Date.now();
                        f.fileContent = fileContent;
                        f.fileColor = props.inputColor;
                        f.fileFont = fileFont;
                        localStorage.setItem('files', JSON.stringify(props.files));
                        navigation('/notepad');
                    }
                }
            }
            return prev;
        })
    })
    
    function selectHandler(e){
        let element = e.target;
        start = element.selectionStart;
        end = element.selectionEnd;
        let activateMenu = document.querySelector('.item-3');
        if(start === end ){
            return;
        };
        let string = element.value.slice(start, end + 1);
        selectedText = string;
        activateMenu.click();
    }

    function changeTextType(e){
        let element = e.target;
        if(element.tagName !== 'BUTTON'){
            element = element.closest('button');
        }
        let type = element.dataset.value;
        switch(type){
            case 'bold': setTmpFileContent(prev => prev.slice(0, start) + ' **' + prev.slice(start, end + 1).trim() + '** ' + prev.slice(end + 1));break;
            case 'italic': setTmpFileContent(prev => prev.slice(0, start) + ' *' + prev.slice(start, end + 1).trim() + '* ' + prev.slice(end + 1));break;
            case 'delete': setTmpFileContent(prev => prev.slice(0, start) + ' ~' + prev.slice(start, end + 1).trim() + '~ ' + prev.slice(end + 1));break;
            case 'normal': setTmpFileContent(prev => prev.match(/[a-z0-9\s\b]/gi).join``);break;
            default: console.log('We do not have access to this font style =('); break;
        }
    }

    function changeFontFamily(e){
        let element = e.target,
            font = element.dataset.value,
            viewContainer = document.querySelector('.file-content-field-preview');
            viewContainer.style.fontFamily = font;
    }
    
    return( 
        <div 
            className="edit-container"
            onClick = {(e) => props.closeLists(e)}
        >
            {storageFiles.length === 0 || !storageFiles ? window.location.href = '/notepad' : ''}
            <header className="navigation-part">
                <Link  to = '/notepad' className = 'main-button-container'>
                    <button className = 'go-to__main-menu-button'>&lt; Back</button>
                </Link>
                <h1 className = 'notepad-title'>{currentFile.fileName}</h1>
            </header>
            <main className="editor-container">
            <nav className="editor-navigation_bar">
                    <ul className="navigation-bar">
                        <li className="navigation-item item-1" 
                            onClick = {(e) => {e.stopPropagation();props.editorListActivate(e)}}
                        >
                        <button className = 'text-font_button'>
                            <span className="current-font-family">{fileFont}</span>
                            <i className="bi bi-chevron-down list-icon"></i>
                        </button>
                        <div 
                            className="fonts-container"
                        >
                            <button 
                                data-value = 'Inter'
                                onClick = {(e) => {changeFontFamily(e); setFileFont(() => e.target.dataset.value)}}
                            >
                                Inter
                            </button>
                            <button 
                                data-value = 'Roboto'
                                onClick = {(e) => {changeFontFamily(e); setFileFont(() => e.target.dataset.value)}}
                            >
                                Roboto
                            </button>
                            <button 
                                onClick = {(e) => {changeFontFamily(e); setFileFont(() => e.target.dataset.value)}}
                                data-value = 'Comfortaa'
                            >
                                Comfortaa
                            </button>
                            <button 
                                data-value = 'CaveAt'
                                onClick = {(e) => {changeFontFamily(e); setFileFont(() => e.target.dataset.value)}}
                            >
                                Caveat
                            </button>
                        </div>
                        </li>
                        <li className="navigation-item item-3" 
                            onClick = {(e) => {e.stopPropagation() ;props.editorListActivate(e)}}
                            // onBlur = 
                        >
                        <button className="text-style__button">
                            <span className="current-text-style">Aa </span>
                            <i className="bi bi-chevron-down list-icon"></i>
                        </button>
                        <div className="text-styles-container">
                            <button
                                data-value = 'bold' 
                                onClick = {(e) => changeTextType(e)}
                            >
                                <b>Aa</b>
                            </button>
                            <button
                                data-value = 'italic'
                                onClick = {(e) => changeTextType(e)}
                            >
                                <i>Aa</i>
                            </button>
                            <button
                                data-value = 'delete'
                                onClick = {(e) => changeTextType(e)}
                            >
                                <del>Aa</del>
                            </button>
                            <button
                                data-value = 'normal'
                                onClick = {(e) => changeTextType(e)}
                            >
                                <span>Aa</span>
                            </button>
                        </div>
                        </li>
                        <li className="navigation-item item-4">
                            <i className="bi bi-droplet-fill fill-icon"></i>
                            <input 
                                type="text" 
                                placeholder = '000000' 
                                value = {props.inputColor} 
                                onBlur = {() => props.blurColor()} 
                                onChange = {(e) => {props.changeHandler(e);currentFile.fileColor = currentFile.fileColor.length  < 2 ? e.target.value : currentFile.fileColor}} 
                                className = 'font-color-field' 
                                onFocus = {(e) => props.colorInputFocusHandler(e)}
                                />
                        </li>
                    </ul>
                </nav>
                <div className="file-content-field">
                    <div className="file-content-field-editor">
                        <textarea 
                            name="file-content" 
                            id="1d2" 
                            cols="30" 
                            rows="10" 
                            className = 'editor' 
                            onKeyDown = {(e) => {props.onKeyEvent(e); setTmpFileContent(() => e.target.value)}}
                            value = {tmpFileContent}  
                            onChange = {(e) => setTmpFileContent(() => e.target.value) }  
                            onSelect = {(e) => selectHandler(e)}
                        ></textarea>
                    </div>
                    <div 
                        className="file-content-field-preview"
                        onMouseDown = {(e) => e.preventDefault()}
                        style = {{fontFamily: fileFont}}
                    >
                        <ReactMarkdown children={tmpFileContent} remarkPlugins={[remarkGfm]} />
                    </div>
                </div>

                <button 
                    className='save-changes_button'
                    onClick = {
                        (e) => {setFileContent(() => document.querySelector('.editor').value);}
                        }   
                >
                    <i className="bi bi-pencil edit-pen-icon"></i>
                </button>
            </main>
        </div>
    )
}
