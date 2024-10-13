import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatBarProps {
  disabled?: boolean;
  onSend: () => void;
  prompts: string[];
  setPrompts: (prompts: string[]) => void;
  apiCallWrapper: (newMessage: string) => Promise<void>;
}

const ChatBar: React.FC<ChatBarProps> = ({
  disabled = false,
  onSend,
  prompts,
  setPrompts,
  apiCallWrapper,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      const newPrompts = [...prompts, message];
      setPrompts(newPrompts);
      onSend();
      apiCallWrapper(message);
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        // padding: '0.5rem',
        // backgroundColor: '#fff',
        // borderRadius: '20px', // More rounded corners
        // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginTop: "1rem",
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Ask a question..."
        value={message}
        onChange={(e) => setMessage(e.target.value.replace(/^\n+/, ""))}
        disabled={disabled}
        multiline // Enable multiline
        maxRows={4} // Limit to a maximum of 4 rows
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            handleSend();
          }
        }}
        sx={{
          flexGrow: 1,
          marginRight: "0.5rem",
          borderRadius: "20px", // Match the border radius
          height: "20%", // Set initial height relative to parent
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px", // Ensure the input has rounded corners
            height: "100%", // Ensure the input uses full height
          },
          "& textarea": {
            overflow: "auto", // Allow overflow for the textarea
            maxHeight: "20%", // Limit height to 20% of the parent element's height
          },
        }}
      />
      <IconButton
        onClick={handleSend}
        disabled={disabled}
        sx={{
          backgroundColor: disabled ? "#e3f2fd" : "#1976d2",
          "&:hover": {
            backgroundColor: disabled ? "#e3f2fd" : "#115293",
          },
          borderRadius: "50%", // Make the button round
          // padding: "0.5rem", // Add some padding
        }}
      >
        <SendIcon
          sx={{
            color: "#fff",
            transform: "rotate(-90deg)",
          }}
        />{" "}
      </IconButton>
    </Box>
  );
};

export default ChatBar;
