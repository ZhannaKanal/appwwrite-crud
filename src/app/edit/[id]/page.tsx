"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, use, useEffect, useState } from "react";

export default function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [formData, setFormData] = useState({ term: "", interpretation: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/interpretations/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();
        console.log(data);
        setFormData({
          term: data.interpretation.term,
          interpretation: data.interpretation.interpretation,
        });
      } catch (error) {
        setError("Faiked to load interpretation.");
      }
    };
    fetchData();
  }, []);

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
      const response = await fetch(`/api/interpretations/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update interpretation");
      }
      router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
    router.push("/");
  };
  return (
    <div>
      <h2 className="my-[32px] text-[30px]">Edit Interpretations</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[12px]">
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
          {isLoading ? "Updating..." : "  Update Interpretation"}
        </button>
      </form>
      {error && <p className="text-[red]">{error}</p>}
    </div>
  );
}
