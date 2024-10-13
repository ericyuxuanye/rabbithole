import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
import TreeList from "./TreeList";
import { RHNodeData } from "../types/data";

type NavbarProps = {
  trees: RHNodeData[];
  setTreeIdx: (treeIdx: number) => void;
};

const Navbar = ({ trees, setTreeIdx }: NavbarProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <TreeList trees={trees} setTreeIdx={setTreeIdx} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Logo
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Services</Button>
          <Button color="inherit">Contact</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
