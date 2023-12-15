import { useEffect, useState } from "react";
import { createNote } from "../../utilities/notes-service";
import * as notesAPI from "../../utilities/notes-api";

export default function NotesIndexPage({ user }) {
   const [notes, setNotes] = useState([]);
   const [newNoteText, setNewNoteText] = useState({ text: "" });

  

   useEffect(function () {
      async function getNotes() {
         const notes = await notesAPI.getAll();
         setNotes(notes);
      }
      getNotes();
   }, []);

   async function handleSubmit(event) {
      event.preventDefault();
      console.log({ user });
      const newNote = {
         text: newNoteText.text,
         user: user._id,
      };
      
      const note = await createNote(newNote);
      setNotes([...notes, note]);
   
      setNewNoteText({ text: "" });
   }

   function handleChange(event) {
      setNewNoteText({
         ...newNoteText,
         [event.target.name]: event.target.value,
      });
      console.log("nnt in handleChange", newNoteText);
   }

   return (
      <div>
         <h1>Notes</h1>
         <form onSubmit={handleSubmit}>
            <input
               name="text"
               value={newNoteText.text}
               onChange={handleChange}
            />
            <button type="submit">Add Note</button>
         </form>

         {notes.length === 0 ? (
            <p>No notes yet!</p>
         ) : (
            <ul>
               {notes.map((note, index) => (
                 user._id == note.user && (<li key={index}>
                     <p>{note.text}</p>
                     <p>{note.createdAt.toLocaleString()}</p>
                  </li>)
               ))}
            </ul>
         )}
      </div>
   );
}
