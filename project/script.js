const API_URL = "http://127.0.0.1:3000/notes";

const list = document.querySelector('.content');
const BtnSearch = document.querySelector('.search_button');
const SearchText = document.querySelector('.forma_input');
const menu = document.querySelectorAll('.tegs_li');
const btnNote = document.querySelector('.menu_button');

const overlay = document.getElementById('overlay');
const modalTitle = document.getElementById('ModalTitle');
const modalSelect = document.getElementById('ModalSelect');
const modalSaveBtn = document.getElementById('ModalButtonSave');
const modalDeleteBtn = document.getElementById('ModalButtonDelete');
const modalCloseBtn = document.getElementById('btnModalClose');

let editingItem = null;
let notes = [];
let activeTag = "Все";

async function loadNotes() {
    const res = await fetch(API_URL);
    notes = await res.json();
    render();
}

async function createNewNote(note) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note)
    });
    return await res.json();
}

async function updateServerNote(note) {
    await fetch(API_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note)
    });
}

async function deleteServerNote(id) {
    await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });
}

function createNoteElement(note) {
    const item = document.createElement('div');
    item.classList.add('zadachi');
    item.innerHTML = `
        <div class="zadachi_item">
            <div class="zadachi_item-top">
                <span>${note.title}</span>
            </div>
            <div class="zadachi_item-down">
                <span>${note.date}</span>
            </div>
        </div>
    `;

    item.addEventListener('click', () => {
        editingItem = note;
        openModal();
    });

    return item;
}

function NotesFilter() {
    const text = SearchText.value.toLowerCase();
    let filtered = notes.filter(n => n.title.toLowerCase().includes(text));
    if (activeTag !== "Все") filtered = filtered.filter(n => n.tag === activeTag);
    return filtered;
}

function render() {
    list.innerHTML = "";
    const filtered = NotesFilter();

    if (filtered.length === 0) {
        list.innerHTML = "<div style='margin-top:20px'>Ничего не найдено</div>";
        return;
    }

    filtered.forEach(note => {
        list.appendChild(createNoteElement(note));
    });
}

function openModal() {
    overlay.classList.add('opened');
    modalTitle.value = editingItem?.title || "";
    modalSelect.value = editingItem?.tag || "Все";
    modalDeleteBtn.style.display = editingItem?.id ? 'block' : 'none';
}

function closeModal() {
    overlay.classList.remove('opened');
    modalTitle.value = "";
    modalSelect.value = "Все";
    editingItem = null;
}

async function saveNote() {
    const noteData = {
        ...editingItem,
        title: modalTitle.value,
        tag: modalSelect.value,
        date: new Date().toLocaleDateString(),
    };

    if (editingItem?.id) {
        await updateServerNote(noteData);
    } else {
        await createNewNote(noteData);
    }

    closeModal();
    loadNotes();
}

async function deleteNote() {
    if (!editingItem?.id) return;
    await deleteServerNote(editingItem.id);
    closeModal();
    loadNotes();
}

function newNote() {
    editingItem = { title: "", tag: "Все", date: "" };
    openModal();
}

function init() {
    loadNotes();

    menu.forEach(tag => {
        tag.addEventListener('click', () => {
            activeTag = tag.textContent.trim();
            render();
        });
    });

    BtnSearch.addEventListener('click', render);
    btnNote.addEventListener('click', newNote);

    modalCloseBtn.addEventListener('click', closeModal);
    modalSaveBtn.addEventListener('click', saveNote);
    modalDeleteBtn.addEventListener('click', deleteNote);
}

init();