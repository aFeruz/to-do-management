import mongoose, { Schema, Document } from 'mongoose';

export enum NoteStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export interface Note extends Document {
  title: string;
  content: string;
  status: NoteStatus;
  userId: mongoose.Types.ObjectId | string;
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(NoteStatus), 
    default: NoteStatus.TODO 
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

NoteSchema.index({ title: 'text', content: 'text' });

export default mongoose.model<Note>('Note', NoteSchema);
