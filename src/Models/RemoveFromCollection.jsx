import { deleteDoc, doc } from "firebase/firestore"
import { db } from ".."
import fetchCollection from "./FetchCollection"

export default async function removeFromCollection(id) {
    try {
        const plantDoc = doc(db, "plant_collection", id)
        await deleteDoc(plantDoc)
        return fetchCollection()
    } catch (err) {
        console.log(err)
    }
}
