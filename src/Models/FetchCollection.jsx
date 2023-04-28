import { db } from ".."
import { getDocs, collection, query } from "firebase/firestore"

export default async function fetchCollection() {
    const plantCollectionsRef = collection(db, "plant_collection")
    const q = query(plantCollectionsRef)
    const data = await getDocs(q)
    return data.docs.map(doc => ({ ...doc.data(), firebaseID: doc.id }))
}
