// src/context/CommentContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  likes: number;
  liked: boolean;
  date: string;
}

interface CommentContextType {
  comments: Comment[];
  addComment: (text: string) => void;
  toggleLike: (id: string) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      user: "Kurumi",
      avatar: "https://th.bing.com/th/id/R.134606fecb0e04b8ce025e361e218e59?rik=mZT931aVBgNr%2bA&riu=http%3a%2f%2fkawaii-mobile.com%2fwp-content%2fuploads%2f2013%2f08%2fDate-A-Live.Kurumi-Tokisaki-Android-wallpaper.1440x1280.jpg&ehk=nUjaHtYidoXVXZmr6WUxG2sVG7ZR2gL1hDZrHssVue8%3d&risl=&pid=ImgRaw&r=0",
      text: "Anime ini keren banget! Visualnya mantap.",
      likes: 120000,
      liked: false,
      date: "2 days ago",
    },
    {
      id: "2",
      user: "Ranggis",
      avatar: "https://raw.githubusercontent.com/Ranggis/Api-Image/main/ranggis.jpg",
      text: "Gila sih episodenya bikin nagih!",
      likes: 480000,
      liked: false,
      date: "1 day ago",
    },
  ]);

  const addComment = (text: string) => {
    if (!text.trim()) return;

    const newEntry: Comment = {
      id: Date.now().toString(),
      user: "You",
      avatar: "https://raw.githubusercontent.com/Ranggis/Api-Image/main/ranggis.jpg",
      text,
      likes: 0,
      liked: false,
      date: "Just now",
    };

    setComments((prev) => [newEntry, ...prev]);
  };

  const toggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  return (
    <CommentContext.Provider value={{ comments, addComment, toggleLike }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const ctx = useContext(CommentContext);
  if (!ctx) {
    throw new Error("useComments must be used inside CommentProvider");
  }
  return ctx;
};
