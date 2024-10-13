import { Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { RHNodeData } from "../types/data";
import TreeList from "./TreeList";

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
          Rabbit Hole
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Button color="inherit">Log In</Button>
          <Button color="inherit">Sign Up</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
