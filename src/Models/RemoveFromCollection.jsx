import { deleteDoc, doc } from "firebase/firestore"
import { db } from ".."
import fetchCollection from "./FetchCollection"

export default async function removeFromCollection(id, userid) {
    try {
        const plantDoc = doc(db, "plant_collection", id)
        await deleteDoc(plantDoc)
        return fetchCollection(userid)
    } catch (err) {
        console.log(err)
    }
}
