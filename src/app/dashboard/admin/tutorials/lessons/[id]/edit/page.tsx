import { notFound } from "next/navigation";
import { LessonForm } from "@/components/dashboard/admin/tutorials/LessonForm";
import { prisma } from "@/lib/prisma";

export default async function EditLessonPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const lesson = await prisma.tutorialsLesson.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      subtopic: {
        include: {
          topic: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  // Format the data for the form
  const initialData = {
    ...lesson,
    topicId: lesson.subtopic.topicId,
    categoryId: lesson.subtopic.topic.categoryId,
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Lesson</h2>
      </div>
      <LessonForm initialData={initialData as any} />
    </div>
  );
}
