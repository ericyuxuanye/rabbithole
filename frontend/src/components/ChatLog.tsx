import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";

interface ChatLogProps {
  prompts: string[];
  responses: string[];
}

export const ChatLog: React.FC<ChatLogProps> = ({ prompts, responses }) => {
  // Determine the length of the longer array to handle mismatched lengths
  const maxLength = Math.max(prompts.length, responses.length);
  
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [prompts, responses]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "400px", // Adjust as needed
        overflowY: "auto", // Enable vertical scrolling
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9", // Light background for chat log
      }}
      ref={boxRef}
    >
      {Array.from({ length: maxLength }).map((_, index) => (
        <React.Fragment key={index}>
          {prompts[index] && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "0.5rem",
              }}
            >
              <Paper
                sx={{
                  padding: "0.75rem 1rem",
                  borderRadius: "20px",
                  backgroundColor: "#e3f2fd", // Color for prompts
                  maxWidth: "70%", // Limit the width of messages
                }}
              >
                <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                  {prompts[index]}
                </Typography>
              </Paper>
            </Box>
          )}
          {responses[index] && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "0.5rem",
                marginLeft: "-0.5rem",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  padding: "0.75rem 0.5rem", // Optional padding for better spacing
                  borderRadius: "20px",
                  backgroundColor: "transparent",
                  color: "#333", // Text color
                  wordWrap: "break-word",
                }}
              >
                {responses[index]}
              </Typography>
            </Box>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};
