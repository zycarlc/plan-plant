import { Box, Button, Modal, Card, CardMedia } from "@mui/material"

import Typography from "@mui/material/Typography"
import axios from "axios"
import { useState } from "react"

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
}

export default function SearchByImagePopUp({ open, setOpen }) {
    const [image, setImage] = useState(null)
    const handleClose = () => {
        setOpen(false)
    }
    const handleSubmit = async e => {
        e.preventDefault()
        setOpen(false)
        const base64file = [image.imageURI]
        const data = {
            api_key: process.env.REACT_APP_FIREBASE_PLANT_ID_API,
            images: base64file,
            // modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers
            modifiers: ["crops_fast", "similar_images"],
            plant_language: "en",
            // plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details
            plant_details: [
                "common_names",
                "url",
                "name_authority",
                "wiki_description",
                "taxonomy",
                "synonyms",
            ],
        }
        axios
            .post("https://api.plant.id/v2/identify", data)
            .then(res => console.log(res))
            .catch(err => {
                console.error("Error", err)
            })
    }

    function handleImage(event) {
        readURI(event)
    }
    function readURI(e) {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader()
            reader.onload = function (ev) {
                const res = ev.target.result
                setImage({ imageURI: res })
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Search by Image
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    What does your plant look like?
                </Typography>
                <form>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/png, image/jpeg"
                        onChange={handleImage}
                    />
                    {image && (
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                height="auto"
                                image={image.imageURI}
                            />
                        </Card>
                    )}
                    <button onClick={handleSubmit} type="button">
                        OK
                    </button>
                </form>
            </Box>
        </Modal>
    )
}
