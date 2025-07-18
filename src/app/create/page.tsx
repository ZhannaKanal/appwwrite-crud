"use client";

import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";

export default function CreatePage() {
  const [formData, setFormData] = useState({ term: "", interpretation: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.term || !formData.interpretation) {
      setError("Please fill all fields");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/interpretations", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create interpretation");
      }
      router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="my-[32px] text-[30px]">Add New Interpretations</h2>
      <form className="flex flex-col gap-[12px]" onSubmit={handleSubmit}>
        <input
          type="text"
          name="term"
          value={formData.term}
          placeholder="Term"
          className="py-[4px] px-[16px] border rounded-[7px]"
          onChange={handleInputChange}
        />
        <textarea
          name="interpretation"
          rows={4}
          value={formData.interpretation}
          placeholder="Interpretation"
          className="py-[4px] px-[16px] border rounded-[7px] "
          onChange={handleInputChange}
        ></textarea>
        <button
          className="bg-[black] text-[white] mt-[20px] px-[16px] py-[4px] rounded-[7px]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "  Add Interpretation"}
        </button>
      </form>
      {error && <p className="text-[red]">{error}</p>}
    </div>
  );
}
