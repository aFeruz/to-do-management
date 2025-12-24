import { Router } from 'express';
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/note.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createNoteSchema, updateNoteSchema } from '../utils/validationSchemas';

const router = Router();

router.use(authenticate); 

router.post('/', validate(createNoteSchema), createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', validate(updateNoteSchema), updateNote);
router.delete('/:id', deleteNote);

export default router;
