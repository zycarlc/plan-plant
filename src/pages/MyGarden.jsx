import { setDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { Stage, Layer, Image } from "react-konva"
import plantIcons from "../components/PlantIcons"
import useImage from "use-image"
import { v4 as uuid } from "uuid"
import { auth, db } from ".."
import { doc, getDoc } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { Alert } from "@mui/material"

async function generateItems(userid) {
    const myGardenRef = doc(db, "my_garden", userid)
    const data = await getDoc(myGardenRef)
    return data.data().data
}

async function updateItems(items, userid) {
    setDoc(doc(db, "my_garden", userid), {
        data: items,
    })
}

const URLImage = ({ image, onDragStart, onDragEnd }) => {
    const [img] = useImage(image.src)
    return (
        <Image
            image={img}
            x={image.x}
            y={image.y}
            id={image.id}
            // I will use offset to set origin to the center of the image
            offsetX={img ? img.width / 2 : 0}
            offsetY={img ? img.height / 2 : 0}
            name={image.id}
            numPoints={5}
            innerRadius={20}
            outerRadius={40}
            draggable
            rotation={image.rotation}
            scaleX={image.isDragging ? 1.2 : 1}
            scaleY={image.isDragging ? 1.2 : 1}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        />
    )
}

const plantIconsArr = Object.values(plantIcons)

export default function MyGarden() {
    const dragUrl = useRef()
    const stageRef = useRef()
    const [images, setImages] = useState([])
    const [user] = useAuthState(auth)
    const [loginAlert, setLoginAlert] = useState(false)

    function handleDragStart(e) {
        const id = e.target.name()
        const items = [...images]
        const item = items.find(i => i.id === id)
        const index = items.indexOf(item)
        // remove from the list:
        items.splice(index, 1)
        // add to the top
        items.push({ ...item, isDragging: images.id === id })
        setImages(items)
    }
    async function handleDragEnd(e) {
        const id = e.target.name()
        const items = [...images]
        const item = items.find(i => i.id === id)
        const index = items.indexOf(item)
        // update item position
        items[index] = {
            ...item,
            x: e.target.x(),
            y: e.target.y(),
            isDragging: false,
        }
        setImages(items)
        updateItems(items, user.uid)
    }
    async function handleOnDrop(e) {
        e.preventDefault()
        if (!user) {
            setLoginAlert(true)
            setTimeout(() => setLoginAlert(false), 3000)
            return
        }
        // register event position
        stageRef.current.setPointersPositions(e)
        // add image
        // console.log(images)
        const newImages = [
            ...images,
            {
                ...stageRef.current.getPointerPosition(),
                src: dragUrl.current,
                id: uuid(),
            },
        ]
        setImages(newImages)
        updateItems(newImages, user.uid)
    }

    useEffect(() => {
        if (!user) return
        generateItems(user.uid).then(res => setImages(res))
    }, [user])

    return (
        <>
            <div
                style={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexWrap: "nowrap",
                    overflowY: "scroll",
                    height: "100px",
                    width: "100%",
                }}
            >
                {plantIconsArr.map((icon, i) => {
                    return (
                        <img
                            style={{ display: "inline-block" }}
                            key={i}
                            alt=""
                            src={icon}
                            draggable="true"
                            onDragStart={e => {
                                dragUrl.current = e.target.src
                            }}
                        />
                    )
                })}
            </div>
            <div onDrop={handleOnDrop} onDragOver={e => e.preventDefault()}>
                {loginAlert && (
                    <Alert severity="error">
                        Please login to use this feature
                    </Alert>
                )}
                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    style={{ border: "1px solid grey" }}
                    ref={stageRef}
                >
                    <Layer>
                        {images.map(image => (
                            <URLImage
                                key={image.id}
                                image={image}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </>
    )
}
