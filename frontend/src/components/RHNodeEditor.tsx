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
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { RHNodeData } from "../types/data";

type RHNodeEditorProps = {
  rootData: RHNodeData;
  setRootData: (newData: RHNodeData) => void;
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
  const [loading, setLoading] = useState(false);

  // const [isEditingName, setIsEditingName] = useState(true);
  const [isEditingPrompt, setIsEditingPrompt] = useState(true);

  const handleClose = () => {
    rhNodeData.name = name;
    rhNodeData.prompt = prompt;
    rhNodeData.response = response;
    const newRootData = { ...rootData };
    setRootData(newRootData);
    onClose();
  };

  const handleApiCall = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/inference?query=" + encodeURIComponent(prompt));
    if (!response.ok) {
      throw new Error("Bad response " + response);
    }
    const json = await response.json();
    setLoading(false);
    setResponse(json.result);
  };

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
            <Typography>
              {`[↑ previous topic: ${rhNodeData.parentName}]`}
            </Typography>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            <>
              <TextField
                label="Query description"
                value={name}
                onChange={(e) => setName(e.target.value)}
                // onKeyDown={(e) => {
                //   if (e.key == "Enter") {
                //     setIsEditingName(false);
                //   }
                // }}
                fullWidth
                margin="normal"
              />
              {/* <IconButton onClick={() => setIsEditingName(false)}>
                  <CheckIcon />
                </IconButton> */}
            </>
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
                  <CheckIcon />
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
          {loading ? <CircularProgress /> : <Typography variant="body1" marginTop={2}>
            Response: {response}
          </Typography>}
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
