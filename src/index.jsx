import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AddNote from './AddNote';
import NoteList from "./NoteList"

class App extends React.Component{
  defaultNote={
    text:"",
    exists:false,
    id:0
  }
  constructor(props){
    super(props);
    this.state={
      notes:[],
      addingNote:false,
      currentNote:{...this.defaultNote},
      noteIndex:0,
    }
    this.addNote=this.addNote.bind(this)
  }
  changeNoteProperty=(newProperties)=>{
    this.setState((prevState,props)=>{
      return({
        state:Object.assign(prevState.currentNote,newProperties)
      })
    })
  }
  addNote=(note)=>{
    note.id=this.state.noteIndex
    this.setState((prevState,props)=>{
      return ({
        notes:prevState.notes.concat([note]),
        noteIndex:prevState.noteIndex+1,
        currentNote:{...this.defaultNote}
      })
    })
  }
  ConfirmNoteChange=()=>{
    this.setState({
      addingNote:false,
      currentNote:{...this.defaultNote}
    })
  }
  showAddNote=(visible)=>{
    this.setState({addingNote:visible})
  }
  setEditingNote=(note)=>{
    this.setState({currentNote:note})
  }
  render(){
    return (
      <div>
        <NoteList showNote={this.showAddNote} setNote={this.setEditingNote} notes={this.state.notes}></NoteList>
        {this.state.addingNote ? <AddNote 
          changer={this.changeNoteProperty}
          note={this.state.currentNote}
          noteAdd={this.addNote}
          changeVisibility={this.showAddNote}
          confirmNoteChange={this.ConfirmNoteChange}
          ></AddNote> : false}
        <button id="add_button" onClick={()=> {this.showAddNote(true)}}>add a note</button>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App></App>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();