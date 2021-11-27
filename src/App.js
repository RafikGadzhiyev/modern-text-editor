import React, { useState, useEffect } from 'react';
import MainPage from "./components/MainPage";
import NotepadPage from './components/NotepadPage';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route
} from 'react-router-dom';
import EditNotepadFile from './components/EditNotepadFile';
import EditNotepadHTMLFile from './components/EditNotepadHTMLFile';
import CreateNewFile from './components/CreateNewFile'
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

let active = false;
const shortId = require('shortid');

window.addEventListener('DOMContentLoaded', () => {
  if(!localStorage.getItem('files')){
    localStorage.setItem('files', JSON.stringify([]));
  }
})



function closeAllLists(e){
  if(active){
      let list = document.querySelector('.navigation-bar'),
        activeIcon = list.querySelector('.active-list'),
        activeList = list.querySelector('.active-flex');
        if(activeIcon && activeList){
          activeIcon.classList.remove('active-list');
          activeList.classList.remove('active-flex')
        }
    }
  
}

function activateEditorMenu(e){
  let closestListItem = e.target.closest('li');
  let editorList = closestListItem.querySelector('div');
  const list = document.querySelector('.navigation-bar');
  let editorLists = list.querySelectorAll('li > div'),
      editorListIcon = closestListItem.querySelector('.list-icon'),
      activatedIcon = list.querySelector('.active-list');
      if(activatedIcon && activatedIcon !== editorListIcon){
        activatedIcon.classList.remove('active-list');
      }
  editorLists.forEach(item => {
    if(item !== editorList){
      item.classList.remove('active-flex');  
    }
  });
  editorList.classList.toggle('active-flex');
  editorListIcon.classList.toggle('active-list');

  let isActive = list.querySelector('.active-flex');
  if(!isActive) active = false;
  else active = true;
}

function onKeyEvent(e){
  let currentElement = e.target;
  if(e.keyCode === 9){
    e.preventDefault();
    let value = currentElement.value,
        start = currentElement.selectionStart;

      currentElement.value = value.slice(0, start) + '\t' + value.slice(start);
    
      currentElement.selectionStart = currentElement.selectionEnd = start + 1;
  }
}
function onKeyDownEvent(e){
  let currentElement = e.target,
    value = currentElement.value,
    start = currentElement.selectionStart, 
    end = currentElement.selectionEnd;
    let string = value.slice(start, end + 1),
        boldString = document.createElement('b');
        boldString.textContent = string;
    currentElement.innerHTML = value.slice(0, start) + boldString + value.slice(end + 1);
    // console.log(currentElement.value)
}

function textAlignmentHandler(e){
  let currentElement = e.target;
  if(!currentElement.classList.contains('text-icon')) return;
  let  list = document.querySelector('.text-position-list'),
      allIcons = list.querySelectorAll('.text-icon');
      allIcons.forEach(item => {
        item.classList.remove('active-icon');
      })

      currentElement.classList.add('active-icon');
      // let textPosition = currentElement.dataset.position;
}

function App() {
  const [color, setColor] = useState('');
  const [size, setSize] = useState(1);
  const [files, setFiles] = useState(JSON.parse(localStorage.getItem('files')) || []);
  const [isDw, setIsDw] = useState({
    'active': false,
    'fileId': ''
  });
  // const [fileEditedContent, setFileEditedContent] = useState('')

  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files])

  function createFileByType(e, fileId, fileType){
    let d;
    for(let f of files){
      if(f.fileId === fileId){
        d = f;
      }
    }
    if(fileType === 'text'){
      let textFile = new Blob([d.fileContent], {type: 'text/plain'}),
          url = URL.createObjectURL(textFile),
          currentElement = e.target;
          currentElement.download = `${d.fileName}.txt`;
          currentElement.href = url;
    }else if(fileType === 'word'){
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: 'MarkDown text',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: d.fileContent,
                  font: d.fileFont,
                  color: d.fileColor.slice(1),
                  size: '2.5pc',
                  break: 2
                }),
              ]
            })
          ]
        }]
      })
    
      Packer.toBlob(doc).then((buffer) => {
        saveAs(buffer, d.fileName + '.docx');
      })
    }

    setIsDw(() => ({
      'active': false,
      'fileId': ''
    }))
  }

  function copyFile(e){
    let currentElement = e.target;
    if(currentElement.tagName === 'I'){
      currentElement = currentElement.closest('button');
    }
    let fileId = currentElement.dataset.copyfileid,
        currentFile,
        totalFiles = 0;
    for(let file of files){
      if(file.fileId === fileId){
        currentFile = file;
      }
    }
    for(let file of files){
      if(file.fileName.includes(currentFile.fileName)) totalFiles ++;
    }
    setFiles(prev => [
      ...prev,
      {
        'fileName': `${currentFile.fileName} ${totalFiles ? `(${totalFiles})` : ''}`,
        'fileContent': currentFile.fileContent,
        'fileId': shortId.generate(),
        'createdDate': Date.now(),
        'fileType': currentFile.fileType,
        'fileColor': color
      }
    ])
  }

  function deleteFileById(e){
    let currentElement = e.target;
    if(currentElement.tagName === 'I'){
      currentElement = currentElement.closest('button');
    }
    let fileId = currentElement.dataset.deletefileid;
   
    const newFiles = files.filter(e => e.fileId !== fileId);
    setFiles(() => newFiles);
  }

  function SetHashOfFocus(){
    if(color.length === 0){
      setColor(() => '#')
    }
  }

  function removeHash(){
    if(color.length === 1){
      setColor(() => '#000000');
    }
  }

  function colorHandler(e){
    let element = e.target,
        dropIcon = document.querySelector('.fill-icon');
    setColor(() => element.value);
    if(element.value.length === 4 || element.value.length === 7){
      dropIcon.style.color = element.style.color = element.value;
      let textContainer = document.querySelector('.file-content-field');
      textContainer.style.setProperty('color', element.value, 'important');
    }else{
      dropIcon.style.color = element.style.color = 'black';
    }
  }

  return (
    <Router>
      <div className = 'wrapper'>
      <Routes>
        <Route path = '/' exact element = {<MainPage/>} />
        <Route path = '/notepad' exact element = {
          <NotepadPage
            exisitngFiles = {files}
            copyFile = {copyFile}
            deleteFile = {deleteFileById}
            d = {createFileByType}
            dwChange = {setIsDw}
            isDwActive = {isDw}
          />
        } />
        <Route path = '/notepad/edit__baseFile/:id' exact element = {
          <EditNotepadFile 
            editorListActivate = {activateEditorMenu}
            colorInputFocusHandler = {SetHashOfFocus}
            changeHandler = {colorHandler}
            blurColor = {removeHash}
            inputColor = {color}
            closeLists = {closeAllLists}
            sizeValue = {size}
            textAlignmentHandler = {textAlignmentHandler}
            onKeyEvent = {onKeyEvent}
            files = {files}
            setFiles = {setFiles}
            onKeyDownEvent = {onKeyDownEvent}
            setColor = {setColor}
          />
          } 
        />
        <Route path = '/notepad/edit__htmlFile/:id' exact element = {
          <EditNotepadHTMLFile
            onKeyEvent = {onKeyEvent}
            files = {files}
            setFiles = {setFiles}
          />} 
        />
        <Route 
          path = '/notepad/create_new-file/:fileType' 
          exact
          element = {
            <CreateNewFile
              files = {files}
              renderNewFile = {setFiles}
            />
          }
        />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
