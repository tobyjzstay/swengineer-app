import { AppBar, Avatar, Box, Icon, IconButton, ListItemIcon, Menu, MenuItem, Toolbar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { Logo } from "./Logo";
import { postRequest } from "./Request";

function Header() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    const appContext = React.useContext(AppContext);
    const user = appContext?.user;

    // React.useEffect(() => {
    //     getRequest("/auth").then(async (response) => {
    //         const json = await response.json();
    //         const { user } = json;
    //         setUser(user);
    //     });
    // }, []);

    React.useEffect(() => {
        fetch(`/api/auth`, {
            method: "GET",
        }).then(async (response) => {
            const json = await response.json();
            const { user } = json;
            appContext?.setUser(user);
        });
    }, []);

    return (
        <AppBar position="sticky" style={{ background: "transparent", boxShadow: "none" }}>
            <Toolbar variant="dense">
                <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                    <Logo scale={0.6} />
                </Box>
                <IconButton onClick={handleClick}>
                    <Avatar sx={{ width: 24, height: 24 }} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            minWidth: 120,
                        },
                    }}
                >
                    {user?.email ? (
                        [
                            <MenuItem key="email" disabled divider>
                                {user.email}
                            </MenuItem>,
                            <MenuItem
                                key="profile"
                                onClick={() => {
                                    navigate("/profile");
                                }}
                            >
                                <ListItemIcon>
                                    <Icon fontSize="small">person</Icon>
                                </ListItemIcon>
                                Profile
                            </MenuItem>,
                            <MenuItem
                                key="logout"
                                onClick={() => {
                                    postRequest("/auth/logout", {}).then(() => {
                                        navigate(0);
                                    });
                                }}
                            >
                                <ListItemIcon>
                                    <Icon fontSize="small">logout</Icon>
                                </ListItemIcon>
                                Log out
                            </MenuItem>,
                        ]
                    ) : (
                        <MenuItem onClick={() => navigate("/login")}>
                            <ListItemIcon>
                                <Icon fontSize="small">login</Icon>
                            </ListItemIcon>
                            Login
                        </MenuItem>
                    )}
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
