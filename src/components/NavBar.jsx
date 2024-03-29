import * as React from "react"
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    InputBase,
} from "@mui/material"

import MenuIcon from "@mui/icons-material/Menu"

import { Grass as GrassIcon, Search as SearchIcon } from "@mui/icons-material"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import SearchByImagePopUp from "./SearchByImagePopup"
import Auth from "./AuthPopUp"
import { auth } from ".."
import { signOut } from "firebase/auth"

import { useNavigate } from "react-router-dom"
import { styled, alpha } from "@mui/material/styles"

const pagesData = {
    "My Collection": "my-collection",
    "My Garden": "my-garden",
}
const pages = Object.keys(pagesData)

const settings = ["Logout"]

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    width: "100%",
    position: "absolute",
    pointerEvents: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "21ch",
            "&:focus": {
                width: "24ch",
            },
        },
    },
}))

const SearchBox = ({ setOpen, handleCloseNavMenu }) => {
    const navigate = useNavigate()
    function submitSearch(e) {
        e.preventDefault()
        let query = e.target.keyword.value
        const queryString = "/search?q=" + query
        navigate(queryString)
        handleCloseNavMenu()
    }
    return (
        <Box
            sx={{
                flexGrow: 0,
                marginRight: "20px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Tooltip
                title="Search By Image"
                sx={{
                    lineHeight: "normal",
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginTop: "2px",
                }}
            >
                <CameraAltIcon
                    sx={{
                        cursor: "pointer",
                    }}
                    onClick={() => setOpen(true)}
                />
            </Tooltip>
            <Search sx={{ display: "inline-block" }}>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <form action="" onSubmit={submitSearch}>
                    <StyledInputBase
                        placeholder="Don't know what to plant?"
                        inputProps={{ "aria-label": "search" }}
                        name="keyword"
                    />
                </form>
            </Search>
        </Box>
    )
}

function ResponsiveAppBar({ user, loading }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null)
    const [anchorElUser, setAnchorElUser] = React.useState(null)
    const [open, setOpen] = React.useState(false)
    const [loginPage, setLoginPage] = React.useState(false)
    const navigate = useNavigate()
    const handleOpenNavMenu = event => {
        setAnchorElNav(event.currentTarget)
    }
    const handleOpenUserMenu = event => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const handleLogout = () => {
        setAnchorElUser(null)
        signOut(auth).catch(error => console.log(error))
    }

    return (
        <AppBar position="static" style={{ backgroundColor: "#226009" }}>
            <Container maxWidth="xl" style={{ color: "#f0eed1" }}>
                <Toolbar disableGutters>
                    <GrassIcon
                        sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        Plan Plants
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map(page => (
                                <MenuItem
                                    key={page}
                                    onClick={() => {
                                        handleCloseNavMenu()
                                        navigate(pagesData[page])
                                    }}
                                >
                                    <Typography textAlign="center">
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                            <MenuItem>
                                <SearchBox
                                    setOpen={setOpen}
                                    handleCloseNavMenu={handleCloseNavMenu}
                                />
                            </MenuItem>
                        </Menu>
                    </Box>
                    <GrassIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        Plan Plants
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {pages.map(page => (
                            <Button
                                key={page}
                                onClick={() => {
                                    handleCloseNavMenu()
                                    navigate(pagesData[page])
                                }}
                                sx={{
                                    my: 2,
                                    color: "inherit",
                                    display: "block",
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        <SearchBox
                            setOpen={setOpen}
                            handleCloseNavMenu={handleCloseNavMenu}
                        />
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                {user ? (
                                    <>
                                        <Tooltip title="Open settings">
                                            <IconButton
                                                onClick={handleOpenUserMenu}
                                                sx={{ p: 0 }}
                                            >
                                                <Avatar
                                                    alt={user.email}
                                                    src="/static/images/avatar/2.jpg"
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            sx={{ mt: "45px" }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                        >
                                            {settings.map(setting =>
                                                setting !== "Logout" ? (
                                                    <MenuItem
                                                        key={setting}
                                                        onClick={
                                                            handleCloseUserMenu
                                                        }
                                                    >
                                                        <Typography textAlign="center">
                                                            {setting}
                                                        </Typography>
                                                    </MenuItem>
                                                ) : (
                                                    <MenuItem
                                                        key={setting}
                                                        onClick={handleLogout}
                                                    >
                                                        <Typography textAlign="center">
                                                            {setting}
                                                        </Typography>
                                                    </MenuItem>
                                                )
                                            )}
                                        </Menu>
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            setLoginPage(true)
                                        }}
                                        sx={{
                                            my: 2,
                                            color: "white",
                                            display: "block",
                                        }}
                                    >
                                        Log in
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
            <SearchByImagePopUp
                open={open}
                setOpen={() => {
                    setOpen(false)
                }}
            />
            <Auth
                open={loginPage}
                setOpen={() => {
                    setLoginPage(false)
                }}
            />
        </AppBar>
    )
}
export default ResponsiveAppBar
