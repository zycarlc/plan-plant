import { useEffect, useState } from "react"
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    Alert,
} from "@mui/material"

import { auth, db } from ".."
import { addDoc, collection } from "firebase/firestore"
import removeFromCollection from "../Models/RemoveFromCollection"
import { useAuthState } from "react-firebase-hooks/auth"

export default function ImgMediaCard({
    result,
    onDelete,
    page,
    plants,
    updateCollection,
}) {
    const plantCollectionsRef = collection(db, "plant_collection")

    const [plantInCollection, setPlantInCollection] = useState(false)

    const [openSigninError, setOpenSigninError] = useState(false)

    //fetch user id
    const [user, loading, error] = useAuthState(auth)

    async function AddToCollection(result) {
        if (!user) {
            setOpenSigninError(true)
            setTimeout(() => setOpenSigninError(false), 3000)
            return
        }
        try {
            result.userid = user.uid
            await addDoc(plantCollectionsRef, result)
            await updateCollection()
            setOpenSigninError(false)
        } catch (err) {
            console.log(err)
        }
    }
    async function remove(id) {
        removeFromCollection(plants[String(id)]).then(res =>
            setPlantInCollection(false)
        )
    }
    useEffect(() => {
        let isPlantInCollection = Object.keys(plants).includes(
            String(result.id)
        )
        setPlantInCollection(isPlantInCollection)
    }, [plants, result.id])
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                alt={result.common_name}
                height="140"
                image={result.default_image?.regular_url}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {result.common_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {result.scientific_name}
                </Typography>
            </CardContent>
            <CardActions>
                {page === "collection-page" ? (
                    <Button onClick={onDelete} size="small">
                        remove
                    </Button>
                ) : plantInCollection ? (
                    <>
                        <Button disabled={true} size="small" onClick={onDelete}>
                            added to collection
                        </Button>
                        <Button onClick={() => remove(result.id)} size="small">
                            remove
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={() => AddToCollection(result)}
                        size="small"
                    >
                        + Collection
                    </Button>
                )}
            </CardActions>
            {openSigninError && (
                <Alert severity="error">Please Log in first</Alert>
            )}
        </Card>
    )
}
