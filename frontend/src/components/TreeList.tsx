import { IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { RHNodeData } from "../types/data";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { useState } from "react";

type TreeListProps = {
  trees: RHNodeData[];
  setTreeIdx: (treeIdx: number) => void;
};

export default function TreeList({ trees, setTreeIdx }: TreeListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        onClick={handleMenuClick}
        sx={{ mr: 2 }}
      >
        <Tooltip title="See query trees">
          <AccountTreeIcon style={{ transform: "rotate(90deg)" }} />
        </Tooltip>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {trees.length > 0 ? (
          trees.map((value, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                setTreeIdx(idx);
              }}
            >
              {value.name}
            </MenuItem>
          ))
        ) : (
          <Typography sx={{ padding: "0 0.5rem" }}>
            No query trees yet. Highlight some text in the pdf to add one!
          </Typography>
        )}
      </Menu>
    </>
  );
}
