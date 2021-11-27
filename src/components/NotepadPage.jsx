import React from 'react'
import { Link } from 'react-router-dom'
import DownloadFileBlock from './DownloadFileBlock';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function NotepadPage(props){
    const files = props.exisitngFiles;

    return(
            <React.Fragment>
                { 
                props.isDwActive.active && 
                <DownloadFileBlock
                 setIsDw = {props.dwChange}
                 fileId = {props.isDwActive.fileId}
                 downloadHandler = {props.d}
                />
            }
        <div className="notepad__content-container">
            <header className="navigation-part">
                <Link  to = '/' className = 'main-button-container'>
                    <button className = 'go-to__main-menu-button'>&lt; Back</button>
                </Link>
                <h1 className = 'notepad-title'>Notepad</h1>
            </header>
            <main className="notepad-container">
                <ul className="notepad-list">
                    {files.map(item => {
                        let fileType = item.fileType,
                            createdDate = new Date(item.createdDate),
                            daysAgo = Math.floor((new Date() - createdDate) / 1000 / 86400);

                        return <li key = {item.fileId} className= {`notepad-file file-1 ${fileType === 'file' ? 'text': 'html-file'}`} data-fileid = {item.fileId}>
                        <div className="file-content-container">
                            <div className="description-container">
                                <h3 className="file-name">{item.fileName}</h3>
                                <span className="last-changes">Last Changes: <time className = 'time'>{
                                    (new Date() - createdDate) / 1000  < 86400 ? createdDate.toLocaleDateString() : 
                                        daysAgo === 1 ? daysAgo + ' day ago' : 
                                        daysAgo < 30 ? daysAgo + ' days ago' : 
                                        daysAgo < 365 ? Math.floor(daysAgo / 30) + ` month${Math.floor(daysAgo / 30) === 1 ? '' : 's'} ago` : 
                                        Math.floor(daysAgo / 364) + ` year${Math.floor(daysAgo / 364) === 1 ? '' : 's'} ago`
                                }</time></span>
                            </div>
                            <div className="options-container">
                            <ul className="options-list">
                                    <li className="option option-1">
                                        <button 
                                            className = 'copy-button' 
                                            data-copyfileid = {item.fileId}
                                            onClick = {(e) => props.copyFile(e)}
                                        >
                                            <i className = 'bi bi-plus-circle copy-icon'></i>
                                        </button>
                                    </li>
                                    <li className="option option-2">
                                        <Link to = {`${fileType === 'file' ? '/notepad/edit__baseFile/' : '/notepad/edit__htmlFile/'}${item.fileId}`}>
                                            <button className = 'edit-button'>
                                                <i className="bi bi-pencil-square edit-icon"></i>
                                            </button>
                                        </Link>
                                    </li>
                                    <li className="option option-3">
                                        <button 
                                            className = 'delete-button' 
                                            data-deletefileid = {item.fileId}
                                            onClick = {(e) => props.deleteFile(e)}
                                        >
                                            <i className="bi bi-x-square delete-icon"></i>         
                                        </button>
                                    </li>
                                    <li className="option option-4">
                                        <button
                                            data-fileid = {item.fileId} 
                                            className = 'download-button'
                                            onClick = {() => props.dwChange(() => ({
                                                'active': true,
                                                'fileId': item.fileId
                                            }))}
                                        >
                                            <i className="bi bi-download download-icon"></i>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    })}
                    <li className="create-new-file notepad-file">
                        <Link to = '/notepad/create_new-file/file'>
                            <button className = 'create-new-file__button'>
                                <i className ="bi bi-plus-lg"></i>
                            </button>
                        </Link>
                    </li>
                </ul>
                <input type="checkbox" id = 'create'  className = 'hidden-spot'/>
                <label htmlFor="create">
                    <div className = 'create__new-file-button'>
                        <i className="bi bi-plus-lg create__file-icon"></i>
                    </div>
                </label>
                    <ul className="file-types">
                            <li className="file fl">
                                <Link to ='/notepad/create_new-file/file'>
                                    <button className="create__file-button">
                                        <i className="bi bi-file-earmark"></i>
                                        Create a file
                                    </button>
                                </Link>
                            </li>
                            <li className="html fl">
                                <Link to = '/notepad/create_new-file/html'>
                                    <button className="create__html-button">
                                        <i className="bi bi-code-slash"></i>
                                        Create an HTMl file
                                    </button>
                                </Link>
                            </li>
                        </ul>
            </main>
        </div>
            </React.Fragment>
    )
}