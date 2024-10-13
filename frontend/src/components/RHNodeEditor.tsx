import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from '@mui/icons-material/Close';
import { RHNodeData } from "../types/data";

type RHNodeEditorProps = {
  rootData: RHNodeData;
  setRootData: React.Dispatch<React.SetStateAction<RHNodeData>>;
  isOpen: boolean;
  rhNodeData: RHNodeData;
  onClose: () => void;
};

export default function RHNodeEditor({
  rootData,
  setRootData,
  isOpen,
  rhNodeData,
  onClose,
}: RHNodeEditorProps) {
  const [name, setName] = useState(rhNodeData.name);
  const [prompt, setPrompt] = useState(rhNodeData.prompt || "");
  const [response, setResponse] = useState(rhNodeData.response || "");

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const handleClose = () => {
    rhNodeData.name = name;
    rhNodeData.prompt = prompt;
    rhNodeData.response = response;
    const newRootData = { ...rootData };
    setRootData(newRootData);
    onClose();
  };
  const handleApiCall = () => {};

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {rhNodeData.parentName && (
            <Typography variant="h6">
              {`[↑ previous topic ${rhNodeData.parentName}]`}
            </Typography>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            {isEditingName ? (
              <>
                <TextField
                  label="Title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      setIsEditingName(false);
                    }
                  }}
                  fullWidth
                  margin="normal"
                />
                <IconButton onClick={() => setIsEditingName(false)}>
                  <SaveIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Typography variant="h6">Title: {name}</Typography>
                <IconButton onClick={() => setIsEditingName(true)}>
                  <EditIcon />
                </IconButton>
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {isEditingPrompt ? (
              <>
                <TextField
                  label="Prompt"
                  value={prompt}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") {
                      setIsEditingPrompt(false);
                    }
                  }}
                  onChange={(e) => setPrompt(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <IconButton onClick={() => setIsEditingPrompt(false)}>
                  <SaveIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Typography variant="h6">Prompt: {prompt}</Typography>
                <IconButton onClick={() => setIsEditingPrompt(true)}>
                  <EditIcon />
                </IconButton>
              </>
            )}
          </div>
          <Typography variant="body1" marginTop={2}>
            Response: {response}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApiCall} color="primary">
            Generate Response
          </Button>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
