import { Blog } from "@/app/models/ipo";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block">
      <Card
        className="h-[424px] p-3 bg-background rounded-lg group-hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden"
        style={{
          borderRadius: "8px",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "10px solid #0073E6",
          boxShadow: "none",
        }}
      >
        <div className="relative rounded-t-lg h-[calc(250px-5px)] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-2">
          {blog.image_url ? (
            <Image
              src={blog.image_url || ""}
              alt={blog.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="w-24 h-16 mx-auto mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold font-ibm-plex text-lg">
                  IPO Milega
                </span>
              </div>
              <p className="text-blue-400 text-xs font-medium tracking-wide">
                {blog.author}
              </p>
            </div>
          )}
        </div>
        <CardHeader className="pb-3">
          <div className="flex flex-row justify-between items-start sm:items-center mb-3 gap-2">
            <Badge
              variant="outline"
              className="text-xs font-medium px-2 py-1 border-blue-200 text-blue-600 bg-blue-50"
              style={{ fontWeight: "400", border: "none" }}
            >
              {blog.category || "IPO Analysis"}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <CardTitle
            className="text-lg font-semibold leading-tight text-slate-800 group-hover:text-blue-600 transition-colors font-ibm-plex"
            style={{ fontWeight: "600" }}
          >
            {blog.title}
          </CardTitle>
          <CardDescription
            className="text-sm text-slate-600 line-clamp-3 mt-2 font-ibm-plex"
            style={{ fontWeight: "400" }}
          >
            {blog.excerpt ||
              blog.content.trim().split(" ").slice(0, 25).join(" ") + "..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-end mb-3">
            <div
              className="flex items-center text-sm font-medium font-ibm-plex text-blue-600 group-hover:text-blue-700 transition-colors"
              style={{ fontWeight: "400" }}
            >
              Read More
              <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
