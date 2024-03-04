const openFormButton = document.getElementById('open-form');
const closeFormButton = document.getElementById('close-form');
const formContainer = document.getElementById('form-container');
const formOverlay = document.querySelector('.form-overlay');
const nameField = document.getElementById('nombre');
const contentField = document.getElementById('content');


openFormButton.addEventListener('click', toggleForm);
closeFormButton.addEventListener('click', toggleForm);

closeFormButton.addEventListener('click', () => {
    nameField.value = '';
    contentField.value = '';
})

function toggleForm() {
    formContainer.classList.toggle('open');
    formOverlay.classList.toggle('open');
}

const notesContainer = document.querySelector('#notes-container');

function renderNotes(notes) {
    notesContainer.innerHTML = '';

    if (notes.length === 0) {
        notesContainer.innerHTML = '<p>No notes available</p>';
    } else {
        const ul = document.createElement('ul');

        notes.forEach((note) => {
            const li = document.createElement('li');
            li.setAttribute('id', note.id);
            li.setAttribute('data-category', note.category);
            li.classList.add('note');

            const nameElement = document.createElement('div');
            nameElement.innerText = note.name;
            nameElement.classList.add('note-name');
            li.appendChild(nameElement);

            const contentElement = document.createElement('div');
            contentElement.innerText = note.content;
            contentElement.classList.add('note-content');
            li.appendChild(contentElement);

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('data-note-id', note.id);
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            li.appendChild(deleteButton);


            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.classList.add('update-button');
            li.appendChild(updateButton);

            const archiveButton = document.createElement('button');
            // archiveButton.innerHTML = '<i class="fas fa-archive"></i>';
            archiveButton.innerHTML = 'Archive';
            archiveButton.classList.add('archive-button');
            li.appendChild(archiveButton);

            ul.appendChild(li);

            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                const noteId = event.target.parentElement.getAttribute('id');

                fetch(`/delete/${noteId}`, {
                    method: 'delete',
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Error al eliminar la nota');
                        }
                        readnotes();
                        location.reload();
                    })
                    .catch((error) => {
                        console.error('Error al eliminar la nota:', error);
                    });
            });

            updateButton.addEventListener('click', () => {
                event.preventDefault();
                const noteId = event.target.parentElement.getAttribute('id');
                // console.log(noteId);
                formContainer.classList.toggle('open');
                formOverlay.classList.toggle('open');

                formContainer.addEventListener('submit', (event) => {
                    event.preventDefault();

                    const updatedName = document.getElementById('nombre').value;
                    const updatedContent = document.getElementById('content').value;
                    const updateCategory = document.getElementById('category').value;

                    if (updatedName === '' || updatedContent === '') {
                        // Los campos están vacíos, no hacer nada
                        return;
                    }

                    fetch(`/update/${noteId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: updatedName,
                            content: updatedContent,
                            category: updateCategory
                        }),
                    })
                        .then((data) => {
                            readnotes();
                            location.reload();
                        })
                        .catch((error) => {
                            console.error('Error al actualizar la nota:', error);
                        });
                });
            });

            archiveButton.addEventListener('click', async (event) => {
                event.preventDefault();
                const noteElement = event.target.closest('li');
                const noteId = noteElement.getAttribute('id');
                try {
                    const response = await fetch('/archive', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            noteId: noteId
                        })
                    });

                    if (response.ok) {
                        const archiveEntry = await response.json();
                        location.reload();
                        console.log('Se ha guardado el ID de la nota en la tabla archive:', archiveEntry);
                    } else {
                        console.error('Error al archivar la nota:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error al realizar la solicitud de archivar la nota:', error);
                }

            })

        });

        notesContainer.appendChild(ul);
    }

}

function readnotes() {
    fetch('/read')
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
                renderNotes(data);
                // location.reload();
            } else {
                console.error('Error al obtener las notas');
            }
        })
        .catch((error) => {
            console.error('Error al obtener las notas:', error);
        });
}

const notesArchiveContainer = document.getElementById('notesArchiveContainer');
function renderArchiveNotes(notes) {
    notesArchiveContainer.innerHTML = '';


    if (notes.length === 0) {
        notesArchiveContainer.innerText = 'No notes archived';
        notesArchiveContainer.classList.add('no-notes-message');
    } else {
        const ul = document.createElement('ul');

        notes.forEach((note) => {
            const li = document.createElement('li');
            li.setAttribute('id', note.noteId);
            li.setAttribute('data-category', note.noteCategory);
            li.classList.add('note');

            const nameElement = document.createElement('div');
            nameElement.innerText = note.noteName;
            nameElement.classList.add('note-name');
            li.appendChild(nameElement);

            const contentElement = document.createElement('div');
            contentElement.innerText = note.noteContent;
            contentElement.classList.add('note-content');
            li.appendChild(contentElement);

            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('data-note-id', note.id);
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            li.appendChild(deleteButton);


            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.classList.add('update-button');
            li.appendChild(updateButton);

            const UnarchiveButton = document.createElement('button');
            UnarchiveButton.innerHTML = 'Unarchive';
            UnarchiveButton.classList.add('Unarchive-button');
            li.appendChild(UnarchiveButton);

            ul.appendChild(li);

            deleteButton.addEventListener('click', (event) => {
                event.preventDefault();
                const noteId = event.target.parentElement.getAttribute('id');
                // console.log(noteId);
                const container = event.target.parentElement.parentElement;
                const isArchived = container.classList.contains('notes-archive');


                fetch(`/delete/${noteId}`, {
                    method: 'delete',
                    body: JSON.stringify({ archive: isArchived }), // Enviar el valor de archive según sea una nota archivada o no
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Error al eliminar la nota');
                        }
                        readnotes();
                        location.reload();
                    })
                    .catch((error) => {
                        console.error('Error al eliminar la nota:', error);
                    });
            });

            updateButton.addEventListener('click', () => {
                event.preventDefault();
                scrollToTop();
                const noteId = event.target.parentElement.getAttribute('id');
                // console.log(noteId);
                formContainer.classList.toggle('open');
                formOverlay.classList.toggle('open');

                formContainer.addEventListener('submit', (event) => {
                    event.preventDefault();

                    const updatedName = document.getElementById('nombre').value;
                    const updatedContent = document.getElementById('content').value;
                    const updateCategory = document.getElementById('category').value;

                    if (updatedName === '' || updatedContent === '') {
                        // Los campos están vacíos, no hacer nada
                        return;
                    }

                    fetch(`/update/${noteId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: updatedName,
                            content: updatedContent,
                            category: updateCategory
                        }),
                    })
                        .then((data) => {
                            readnotes();
                            location.reload();
                        })
                        .catch((error) => {
                            console.error('Error al actualizar la nota:', error);
                        });
                });
            });

            UnarchiveButton.addEventListener('click', async (event) => {
                event.preventDefault();
                const noteElement = event.target.closest('li');
                const noteId = noteElement.getAttribute('id');
                // console.log(noteId);
                fetch(`/unarchive/${noteId}`, {
                    method: 'delete',
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Error al eliminar la nota');
                        }
                        readnotes();
                        location.reload();
                    })
                    .catch((error) => {
                        console.error('Error al eliminar la nota:', error);
                    });

            })

        });
        // })
        notesArchiveContainer.appendChild(ul);
    }
}

function readArchiveNotes() {
    fetch('/readArchiveNotes')
        .then(response => response.json())
        .then(notes => {
            if (Array.isArray(notes)) {
                renderArchiveNotes(notes);
            } else {
                console.log('notes no es un array');
            }
        })
        .catch(error => {
            console.error('Error al obtener las notas:', error);
        });
}

function filterNotes() {
    const category = document.getElementById("categoryFilter").value;
    const notesContainer = document.getElementById("notes-container");
    const notes = notesContainer.getElementsByClassName("note");

    // Mostrar u ocultar las notas según la categoría seleccionada
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const noteCategory = note.getAttribute("data-category");

        if (category === "all" || category === noteCategory) {
            note.style.display = "block";
        } else {
            note.style.display = "none";
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

readnotes();
readArchiveNotes();