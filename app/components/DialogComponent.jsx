"use client";
import React from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
} from "@mui/material";
import DisplayYoutubeShort from "./DisplayYoutubeVideo";

export default function DialogCard({ open, handleClose, data }) {
  const workout_id = data?.id;
  const hasValidId = workout_id !== null && workout_id !== undefined;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: "80vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        variant="h4"
        sx={{
          textAlign: "center",
          fontFamily: "Bitcount Grid Double",
          fontWeight: "bold",
        }}
      >
        Video Instruction
      </DialogTitle>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        {/**left side of dialog*/}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: { xs: "center", md: "left" },
            px: 2,
            py: { xs: 10, md: 0 },
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: "Bitcount Grid Double", fontWeight: "bold" }}
          >
            YouTube Video
          </Typography>

          {hasValidId ? (
            <DisplayYoutubeShort workout_id={workout_id} />
          ) : (
            <Typography sx={{ mt: 2 }}>No video available.</Typography>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
