"use client";

import { useEffect, useState, use } from "react";
import { CategoryForm } from "@/components/dashboard/admin/tutorials/CategoryForm";
import { Loader2 } from "lucide-react";

export default function EditTutorialCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/tutorial-categories/${id}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!data) return <div className="text-center p-12 text-muted-foreground">Category not found.</div>;

  return <CategoryForm initialData={data} />;
}