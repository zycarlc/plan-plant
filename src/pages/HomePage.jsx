import Box from "@mui/material/Box"
import { useRef, useState, useEffect } from "react"
import Paper from "@mui/material/Paper"
import InputBase from "@mui/material/InputBase"
import IconButton from "@mui/material/IconButton"
import SearchIcon from "@mui/icons-material/Search"
import { useNavigate } from "react-router-dom"
import { Typography } from "@mui/material"

export default function Homepage() {
    const navigate = useNavigate()
    const [height, setHeight] = useState(window.innerHeight)
    const [offSetTop, setOffSetTop] = useState(0)
    const homeRef = useRef()

    function submitSearch(e) {
        e.preventDefault()
        let query = e.target.keyword.value
        const queryString = "/search?q=" + query
        navigate(queryString)
    }

    function handleWindowSizeChange() {
        setHeight(window.innerHeight)
        setOffSetTop(getOffSet())
    }

    function getOffSet() {
        return homeRef.current.getBoundingClientRect().top
    }

    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange)
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange)
        }
    })

    useEffect(() => {
        setOffSetTop(getOffSet())
    }, [])

    return (
        <Paper
            component="form"
            sx={{
                p: "2px 4px",
                position: "relative",
                height: `${height - offSetTop}px`,
                margin: 0,
                boxSizing: "border-box",
            }}
            onSubmit={submitSearch}
            ref={homeRef}
        >
            <Box
                sx={{
                    ml: 1,
                    flex: 1,
                    margin: 0,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: "10px",
                    borderRadius: "5px",
                }}
            >
                <Typography
                    variant="p"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                        mr: 2,
                        fontSize: { xs: "36px", md: "56px" },
                        display: "flex",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: "#226009",
                        textDecoration: "none",
                    }}
                >
                    Plan Plants
                </Typography>
                <InputBase
                    placeholder="Grow your plan here"
                    inputProps={{ "aria-label": "Start with a plant" }}
                    name="keyword"
                />
                <IconButton type="submit" aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Box>
        </Paper>
    )
}
