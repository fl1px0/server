let idCounter = 0
const tags = [
  { id: 1, title: 'Все' },
  { id: 2, title: 'Идеи' },
  { id: 3, title: 'Личное' },
  { id: 4, title: 'Работа' },
  { id: 5, title: 'Список покупок' }
]
const notes = [
    { id: 1, title: 'Сдать отчет', tag: 4, updateAt: new Date().toDateString() },
    { id: 2, title: 'Заметка 2', tag: 5, updateAt: new Date().toDateString() },
    { id: 3, title: 'Заметка 3', tag: 2, updateAt: new Date().toDateString() }
];

function initMaxId(){
    for(let note of notes){
        if (note.id > idCounter){
            idCounter = note.id
        }
    }
    idCounter++
}
initMaxId()

export function getAllNotes(){
    return notes
}

export function createNote(dto){
    const newNote = {
        id: idCounter++,
        title: dto.title,
        tag: dto.tag,
        updateAt: new Date().toDateString()
    }
    notes.push(newNote)
    return newNote
}

export function deleteNote(id){
    const idx = notes.findIndex(i => i.id === id)
    if (idx === -1){
        return false
    }
    notes.splice(idx, 1)
    return true
}

export function updateNote(note){
    const editeNote = notes.find((i) => i.id === note.id)
    if (editeNote === undefined){
        return false
    }
    editeNote.title = note.title
    editeNote.tag = note.tag
    editeNote.updateAt = new Date().toDateString()
    return editeNote
}