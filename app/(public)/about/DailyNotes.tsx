"use client";

import React from "react";

export interface DailyNote {
  date: string;
  content: string;
}

interface Props {
  notes: DailyNote[];
}

export default function DailyNotes({ notes }: Props) {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-4">Daily Notes</h2>
      {notes.length === 0 ? (
        <p className="text-muted-foreground">No notes available.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note, i) => (
            <li key={i} className="p-4 bg-card rounded-md shadow-sm">
              <p className="text-sm text-muted-foreground mb-1">{new Date(note.date).toLocaleDateString()}</p>
              <p className="text-lg">{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
