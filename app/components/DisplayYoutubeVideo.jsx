"use client";
import React, { useState, useEffect } from "react";
import { Box, Card } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";

export default function DisplayYoutubeShort({ workout_id }) {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!workout_id) return;

    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("workout_videos")
        .select("id, video_id")
        .eq("workout_id", workout_id);

      if (error) {
        console.error("Error fetching videos:", error);
        setError(error.message);
      } else {
        setVideos(data || []);
      }
    };

    fetchVideos();
  }, [workout_id]);

  if (error) return;
  <Box>Error loading videos: {error}</Box>;
  if (videos.length === 0) return;
  <Box>No videos available.</Box>;

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
      gap={2}
      p={2}
    >
      {videos.map((video) => (
        <Card
          key={video.id}
          sx={{
            p: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 3,
            borderRadius: 2,
            width: "100%",
          }}
        >
          <Box
            component="iframe"
            width="100%"
            height="550px"
            src={`https://www.youtube.com/embed/${video.video_id}`}
            title="American Turk on YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Card>
      ))}
    </Box>
  );
}
