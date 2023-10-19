import { db } from ".."
import { getDocs, collection, query, where } from "firebase/firestore"

export default async function fetchCollection(userid) {
    if (!userid) {
        return
    }
    const plantCollectionsRef = collection(db, "plant_collection")
    const q = query(plantCollectionsRef, where("userid", "==", userid))
    const data = await getDocs(q)
    return data.docs.map(doc => ({ ...doc.data(), firebaseID: doc.id }))
}
