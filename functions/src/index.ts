import * as functions from 'firebase-functions';
import { postCreate, postUpdate, postDelete } from './posts';


const postsDocuments = functions.firestore.document('posts/{id}');
export const createPost = postsDocuments.onCreate((snapshot, context) => postCreate(snapshot, context.params.id));
export const updatePost = postsDocuments.onUpdate((snapshot, context) => postUpdate(snapshot, context.params.id));
export const deletePost = postsDocuments.onDelete((snapshot, context) => postDelete(snapshot, context.params.id));