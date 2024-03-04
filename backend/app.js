const { PrismaClient } = require('@prisma/client');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const staticPath = path.join(__dirname, '../frontend');
app.use(express.static(staticPath));


const prisma = new PrismaClient();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/save', async (req, res) => {
    const { name, content, category } = req.body;
    // const {category} = req.body;
    // console.log(category , "category");

    if (name === '' || content === '') {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    try {
        const newNote = await prisma.notes.create({
            data: {
                name,
                content,
                category
            }
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error al crear el registro:', error);
        res.status(500).send('Error al crear el registro');
    }
})

app.get('/read', async (req, res) => {
    try {
        const allNotes = await prisma.notes.findMany();

        // Enviar las notas como respuesta en formato JSON
        res.json(allNotes);
        // console.log(allNotes);

    } catch (error) {
        console.error('Error al obtener las notas:', error);
        res.status(500).send('Error al obtener las notas');
    }
});

app.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    // console.log(id);

    try {
        let note;
        let archiveNote;

        // Verificar si la nota está guardada en la tabla "archive"
        archiveNote = await prisma.archive.findUnique({
            where: { id },
            include: { note: true }
        });

        if (archiveNote) {
            // Si la nota está guardada en la tabla "archive", eliminarla primero de esa tabla
            await prisma.archive.delete({ where: { id } });
            note = archiveNote.note;
        } else {
            // Si la nota no está guardada en la tabla "archive", obtener la nota directamente en la tabla "notes"
            note = await prisma.notes.findUnique({ where: { id } });
        }

        if (!note) {
            throw new Error('No se encontró la nota correspondiente en la tabla "notes"');
        }

        // Eliminar el registro de la tabla "notes"
        await prisma.notes.delete({ where: { id: note.id } });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error al eliminar la nota:', error);
        res.sendStatus(500);
    }
});

app.put('/update/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, content, category } = req.body;
    // console.log(name, content, id);

    try {
        let note;
        let archiveNote;

        // Verificar si la nota está guardada en la tabla "archive"
        archiveNote = await prisma.archive.findUnique({
            where: { id },
            include: { note: true }
        });

        if (archiveNote) {
            // Si la nota está guardada en la tabla "archive", obtener la nota correspondiente en la tabla "notes"
            note = archiveNote.note;
        } else {
            // Si la nota no está guardada en la tabla "archive", obtener la nota directamente en la tabla "notes"
            note = await prisma.notes.findUnique({ where: { id } });
        }

        if (!note) {
            throw new Error('No se encontró la nota correspondiente en la tabla "notes"');
        }

        // Actualizar los datos de la nota en la tabla "notes"
        const update = await prisma.notes.update({
            where: {
                id: note.id
            },
            data: {
                name: name,
                content: content,
                category: category
            }
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error al actualizar la nota:', error);
        res.sendStatus(500);
    }
});

app.post('/archive', async (req, res) => {
    const { noteId } = req.body;
    // const noteId = parseInt(req.params.id);
    const newnoteid = parseInt(noteId);
    try {
        const existingArchiveEntry = await prisma.archive.findFirst({
            where: {
                noteId: newnoteid
            }
        });

        if (existingArchiveEntry) {
            console.log('El ID de la nota ya está guardado en la tabla archive');
        } else {
            // Guardar el ID de la nota en la tabla archive
            const newArchiveEntry = await prisma.archive.create({
                data: {
                    noteId: newnoteid
                }
            });

            console.log('Se ha guardado el ID de la nota en la tabla archive:', newArchiveEntry);
            res.status(200).json(newArchiveEntry);
        }
    } catch (error) {
        console.error('Error al archivar la nota:', error);
        res.status(500).json({ error: 'Error al archivar la nota' });
    }
});

app.get('/readArchiveNotes', async (req, res) => {
    try {
        //         // Obtener todas las entradas en la tabla archive
        const archiveEntries = await prisma.archive.findMany({
            include: {
                note: true // Incluir la relación con la tabla notes
            }
        });

        const notes = archiveEntries.map(entry => ({
            noteId: entry.id,
            noteName: entry.note.name,
            noteContent: entry.note.content,
            noteCategory: entry.note.category
        }));
        res.status(200).json(notes);
        // console.log(notes);

    } catch (error) {
        console.error('Error al obtener las notas:', error);
        res.status(500).json({ error: 'Error al obtener las notas' });
    }
});

app.delete('/unarchive/:id', async (req, res) => {
    const noteId = parseInt(req.params.id);
    // console.log(noteId);
    try {
        const deletearchivenotes = await prisma.archive.delete({
            where: {
                id: noteId
            }
        });
        res.sendStatus(200);
    } catch (error) {
        console.error('Error al eliminar la nota:', error);
        res.sendStatus(500);
    }
})

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
})
