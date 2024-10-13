import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { RHNodeData } from "../types/data";
import { truncateString } from "../util";
import ChatBar from "./ChatBar";
import { ChatLog } from "./ChatLog";

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
  const [prompts, setPrompts] = useState(rhNodeData.prompts);
  const [responses, setResponses] = useState(rhNodeData.responses);
  const [loading, setLoading] = useState(false);
  const [chatDisabled, setChatDisabled] = useState(false);

  useEffect(() => {
    setName(rhNodeData.name);
    setPrompts(rhNodeData.prompts);
    setResponses(rhNodeData.responses);
    setLoading(false);
    setChatDisabled(false);
  }, [rhNodeData])

  // console.log(rootData);
  // console.log(rhNodeData);

  const handleClose = () => {
    rhNodeData.name = name;
    rhNodeData.prompts = prompts;
    rhNodeData.responses = responses;
    const newRootData = { ...rootData };
    setRootData(newRootData);
    onClose();
  };

  const handleApiCall = async (prompts: string[], responses: string[]) => {
    setLoading(true);
    
    // const response = await fetch("http://localhost:8000/inference?query=" + encodeURIComponent(prompt));
    // if (!response.ok) {
    //   throw new Error("Bad response " + response);
    // }
    // const json = await response.json();

    const newResponses = [...responses, `new response ${responses.length + 1}`];
    setResponses(newResponses);
    setChatDisabled(false);
    setLoading(false);
    // setResponse(json.result);
  };

  const apiCallWrapper = async (newMessage: string) => {
    handleApiCall([...prompts, newMessage], responses);
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "50vw",
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
            prompts={prompts}
            responses={
              prompts.length > 0
                ? responses
                : ["Ask a question to get started!"]
            }
          />

          <ChatBar
            onSend={() => {
              setChatDisabled(true);
              // const newPrompts = [...prompts];
              // setPrompts(newPrompts);
              // mess with this later
            }}
            disabled={chatDisabled}
            prompts={prompts}
            setPrompts={setPrompts}
            apiCallWrapper={apiCallWrapper}
          />

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
