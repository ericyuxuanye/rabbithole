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
  Box,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { RHNodeData } from "../types/data";
import { truncateString } from "../util";
import { ChatLog } from "./ChatLog";
import ChatBar from "./ChatBar";

type RHNodeEditorProps = {
  rootData: RHNodeData;
  setRootData: (newData: RHNodeData) => void;
  isOpen: boolean;
  rhNodeData: RHNodeData;
  onClose: () => void;
  setFocusedUuid: (focusedUuid: string) => void;
};

export default function RHNodeEditor({
  rootData,
  setRootData,
  isOpen,
  rhNodeData,
  onClose,
  setFocusedUuid,
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
    // const response = await fetch("http://localhost:8000/inference?query=" + encodeURIComponent(prompt));
    // if (!response.ok) {
    //   throw new Error("Bad response " + response);
    // }
    // const json = await response.json();
    setLoading(false);
    // setResponse(json.result);
    setResponse("le poo poo");
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "35vw",
          },
        }}
      >
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center", // Center items vertically
                overflowX: "auto", // Enable horizontal scrolling
                whiteSpace: "nowrap", // Prevent text wrapping
                padding: "0 1rem 1rem 0", // top right bottom left
              }}
            >
              <Typography variant="body1">Parent query:</Typography>
              <Box
                sx={{
                  display: "flex", // Add flex display to center content
                  alignItems: "center", // Center text vertically within the box
                  borderRadius: "8px", // Rounded corners
                  backgroundColor: "background.paper", // Background color
                  marginLeft: "1rem",
                  padding: "0.5rem 1rem", // Padding inside the box
                  boxShadow: 2, // Shadow for elevation
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  onClick={() => setFocusedUuid(rhNodeData.parentUuid!)}
                  sx={{
                    color: "primary.main", // MUI primary color
                    cursor: "pointer", // Change cursor to pointer to indicate it's clickable
                    "&:hover": {
                      textDecoration: "underline", // Ensure underline on hover
                    },
                  }}
                >
                  {`${truncateString(rhNodeData.parentName, 20)}`}
                </Typography>
              </Box>
            </Box>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <>
              <TextField
                label="Query description"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
            </>
          </div>
          {/* <div style={{ display: "flex", alignItems: "center" }}>
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
          </div> */}

          <ChatLog
            prompts={rhNodeData.prompts}
            responses={
              rhNodeData.prompts.length > 0
                ? rhNodeData.responses
                : ["Ask a question to get started!"]
            }
          />

          <ChatBar onSend={() => {}} disabled={false} />

          {/* {loading ? (
            <CircularProgress />
          ) : (
            <Typography variant="body1" marginTop={2}>
              Response: {response}
            </Typography>
          )} */}
          {rhNodeData.children!.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                overflowX: "auto", // Enable horizontal scrolling
                whiteSpace: "nowrap", // Prevent text wrapping
                padding: "1rem 1rem 1rem 0", // top right bottom left
              }}
            >
              <Typography variant="body1" sx={{ marginRight: "1rem" }}>
                Subqueries:
              </Typography>
              {rhNodeData.children!.map((child, idx) => (
                <Box
                  key={idx}
                  sx={{
                    borderRadius: "8px", // Rounded corners
                    backgroundColor: "background.paper", // Background color
                    padding: "0.5rem 1rem", // Padding inside the box
                    marginRight: "1rem", // Space between boxes
                    boxShadow: 2, // Shadow for elevation
                    "&:last-child": {
                      marginRight: 0, // Remove margin for the last item
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    component="span"
                    onClick={() => setFocusedUuid(child.uuid!)}
                    sx={{
                      color: "primary.main", // MUI primary color
                      cursor: "pointer", // Change cursor to pointer to indicate it's clickable
                      "&:hover": {
                        textDecoration: "underline", // Ensure underline on hover
                      },
                    }}
                  >
                    {`${truncateString(child.name, 10)}`}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleApiCall} color="primary">
            Generate Response
          </Button>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
}
