"use client";
import { useEffect, useState, use } from "react";
import { SubtopicForm } from "@/components/dashboard/admin/tutorials/SubtopicForm";
import { Loader2 } from "lucide-react";

export default function EditTutorialSubtopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/tutorial-subtopics/${id}`)
      .then(res => res.json())
      .then(d => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!data) return <div className="text-center p-12 text-muted-foreground">Subtopic not found.</div>;

  return <SubtopicForm initialData={data} />;
}