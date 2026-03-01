import projects from "@/data/projects.json";
import { notFound } from "next/navigation";
import ProjectDetail from "./ProjectDetail";
import { ProjectData } from "./ProjectDetail";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectDetail project={project as ProjectData} />;
}