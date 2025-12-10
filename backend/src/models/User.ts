import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'admin' | 'editor';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est obligatoire"],
      unique: true,
      trim: true,
      minlength: [3, "Le nom d'utilisateur doit contenir au moins 3 caractères"],
    },
    passwordHash: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
    },
    role: {
      type: String,
      required: [true, 'Le rôle est obligatoire'],
      enum: ['admin', 'editor'],
      default: 'editor',
    },
  },
  {
    timestamps: true,
  }
);


export const User = model<IUser>('User', UserSchema);
export default User;