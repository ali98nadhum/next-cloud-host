"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AddCommentFormProps {
  articleId: number;
}

const CommentForm = ({ articleId }: AddCommentFormProps) => {
  const router = useRouter();

  const [text, setText] = useState("");

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text === "") return toast.error("Please write something");

    try {
      await axios.post(`https://next-cloud-host-ewq0r9dx5-ali98nadhums-projects.vercel.app/api/comments`, {
        text,
        articleId,
      });
      router.refresh();
      setText("");
    } catch (error: any) {
      toast.error(error?.response.data.message);
    }
  };

  return (
    <form onSubmit={formSubmitHandler} className="">
      <input
        className="rounded-lg text-xl p-2 w-full bg-white focus:shadow-md"
        type="text"
        placeholder="Add Comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-700 text-white mt-2 p-1 w-min text-xl rounded-lg hover:bg-green-900 transition"
      >
        Comment
      </button>
    </form>
  );
};

export default CommentForm;
