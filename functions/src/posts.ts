import * as functions from 'firebase-functions';
import admin = require("firebase-admin");

const db = admin.firestore();
const teasersList = db.collection('teasers').doc('posts');

/**
 * method called on create of a post
 * @param snapshot
 * @param id
 */
export async function postCreate(snapshot: functions.firestore.DocumentSnapshot, id: string) {
    const data = snapshot.data();                // get document data
    const teaser = getTeaserObject(data, id);    // create teaser
    await updateTeaserList(teaser, id);          // update list with teasers

    return true;
}

/**
 * method called on delete of a post
 * @param snapshot
 * @param id
 */
export async function postDelete(snapshot: functions.firestore.DocumentSnapshot, id: string) {
    const data = snapshot.data();                // get document data
    const teaser = getTeaserObject(data, id);    // create teaser

    // update list - remove the teaser element
    teasersList.update({
        all: admin.firestore.FieldValue.arrayRemove(teaser)
    }).catch();

    return true;
}

/**
 * method called on update
 * @param change
 * @param id
 */
export async function postUpdate(change: functions.Change<functions.firestore.DocumentSnapshot>, id: string) {
    const newValue = change.after.exists ? change.after.data() : null;        // get new value or null
    if (newValue === null) return true;    // don't proceed if null object

    const teaser = getTeaserObject(newValue, id);        // create teaser
    await updateTeaserList(teaser, id);                // update item in the list

    return true;
}

/**
 * create a teaser for a post
 * @param data snapshot data
 * @param id post id
 */
function getTeaserObject(data: any, id: string) {
    return {
        id: id,
        title: data.title || '',
        shortDescription: data.shortDescription || '',
        thumb: data.thumb || '',
        category: (data.category) ? data.category.name : '',
        author: (data.author) ? `${data.author.firstName} ${data.author.lastName}` : '',
    }
}

/**
 * update post record inside /teasers/posts/all
 *
 * @param teaser post teaser object
 * @param id post id
 */
async function updateTeaserList(teaser: any, id: string): Promise<boolean> {
    const propertyName = 'all';    // property in the teasers/posts document where array of teasers is stored

    const teasersListDoc = await teasersList.get(); // get teasers list document
    if (!teasersListDoc.exists) {
        // if document doesn't exist, create a new one
        teasersList.create({
            [propertyName]: []
        }).catch();
    }

    // create an empty array if document didnt exist
    const teasersListData = teasersListDoc.data() || { propertyName: [] };

    // find item to update by id
    const index = teasersListData[propertyName].findIndex((item: any) => item.id === id);

    // if found, update it
    if (index !== -1) {
        teasersListData[propertyName][index] = teaser;
    } else { // or append new
        teasersListData[propertyName].push(teaser);
    }
    // save document document
    teasersList.set(teasersListData).catch(); // save list

    return true;
}