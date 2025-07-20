"use client";
import * as React from "react";
import { useState } from "react";

export default function HomePage() {
  const getInvites = async (userId: string) => {
    const res = await fetch(`/api/invites/${userId}`);
    const data = await res.json();
    console.log(`User invited ${data.count} users`);
  };

  const [userId, setUserId] = useState("");

  return (
    <div>
      <input type="text" placeholder="User ID" onChange={(e) => {
        setUserId(e.target.value);
      }} />
      <button onClick={() => getInvites(userId)}>Get Invites</button>
      <div>
        {userId}
      </div>
    </div>
  );
}
