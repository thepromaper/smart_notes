import React from 'react';
import './AddNote.css';
import PropTypes from 'prop-types';
import ReminderDialogue from './AddReminder';
import ReminderItem from './ReminderItem';
import TextEditor from './Text/TextEditor';

class AddNote extends React.Component {
  defaultReminder = {
    time: '00:00',
    unit: 0,
    repeat_unit_amount: 1,
    max_reminders: -1,
    exists: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      addingReminder: false,
      currentReminder: { ...this.defaultReminder },
    };
  }

  fixMissingAttachments = () => {
    const { note } = this.props;
    const newAttachments = [];
    note.attached.forEach((attachment, index) => {
      const attachPosition = note.text.indexOf(`[attachment #${index}]`);
      if (attachPosition !== -1) {
        // We replace the old index with the new one.
        note.text = `${note.text.substring(0, attachPosition)}[attachment #${newAttachments.length}]${note.text.substring(attachPosition + 15)}`;
        newAttachments.push(attachment);
      }
    });
    note.attached = newAttachments;
  };

  newReminder = () => {
    this.setState({
      addingReminder: true,
      currentReminder: { ...this.defaultReminder },
    });
  };

  resetReminder = () => {
    this.setState({
      currentReminder: { ...this.defaultReminder },
    });
  };

  confirmReminder = () => {
    const { note, changer } = this.props;
    const { currentReminder } = this.state;

    if (currentReminder.exists) {
      const newReminders = [...note.reminders];
      newReminders[currentReminder.id] = currentReminder;
      changer({ reminders: newReminders });
    } else {
      currentReminder.id = note.reminders.length;
      currentReminder.exists = true;
      changer({ reminders: [...note.reminders, currentReminder] });
    }
  };

  setReminder = (reminder) => {
    this.setState({
      currentReminder: reminder,
    });
  };

  setReminderVisible = (visible) => {
    this.setState({
      addingReminder: visible,
    });
  };

  render() {
    const {
      timeUnits, note, changeVisibility, confirmNoteChange, noteAdd, deleteNote, changer,
    } = this.props;
    const { addingReminder, currentReminder } = this.state;
    return (
      <div id="add_dialogue">
        {addingReminder ? (
          <ReminderDialogue
            reminder={currentReminder}
            setReminder={this.setReminder}
            setVisible={this.setReminderVisible}
            reset={this.resetReminder}
            note={note}
            confirm={this.confirmReminder}
          />
        ) : false}

        {note.exists ? <button type="button" onClick={() => { deleteNote(note); }}>delete</button> : false}
        <button id="add_note_close" onClick={() => { changeVisibility(false); }} type="button">close</button>
        <button
          id="note_add_confirm"
          onClick={() => {
            if (note.exists) {
              this.fixMissingAttachments();
              confirmNoteChange();
            } else {
              this.fixMissingAttachments();
              note.exists = true;
              noteAdd(note);
              changeVisibility(false);
            }
          }}
          type="button"
        >
          {note.exists ? 'save edits' : 'save'}
        </button>

        <div id="note_properties">
          <h1>Note:</h1>

          <TextEditor note={note} noteChanger={changer} />

          <h2>Reminders:</h2>

          <button type="button" onClick={this.newReminder}>Add reminder</button>
          {note.reminders.map((reminderObject, _reminderIndex) => (
            <ReminderItem
              key={reminderObject.id}
              setReminder={this.setReminder}
              setReminderVisible={this.setReminderVisible}
              reminder={reminderObject}
              timeUnits={timeUnits}
            />
          ))}
        </div>
      </div>
    );
  }
}

const {
  func, string, bool, shape,
} = PropTypes;

AddNote.propTypes = {
  changer: func.isRequired,
  confirmNoteChange: func.isRequired,
  changeVisibility: func.isRequired,
  noteAdd: func.isRequired,
  deleteNote: func.isRequired,
  note: shape({
    text: string,
    exists: bool,
    reminders: PropTypes.arrayOf(PropTypes.shape({
      time: PropTypes.string,
      unit: PropTypes.number,
      repeat_unit_amount: PropTypes.number,
      max_reminders: PropTypes.number,
      id: PropTypes.number,
    })),
    attached: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  timeUnits: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AddNote;
