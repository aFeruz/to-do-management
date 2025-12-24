import { Request, Response, NextFunction } from 'express';
import Note, { NoteStatus } from '../models/note.model';
import { AuthRequest } from '../middleware/auth';

export const createNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, status } = req.body;
    const userId = req.user.id;

    const note = new Note({
      title,
      content,
      status,
      userId,
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { status, search, page = 1, limit = 10 } = req.query;

    const query: any = { userId };

    if (status && Object.values(NoteStatus).includes(status as NoteStatus)) {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notes = await Note.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Note.countDocuments(query);

    res.status(200).json({
      data: notes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const updates = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
