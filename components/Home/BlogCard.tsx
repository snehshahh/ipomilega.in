import { Blog } from "@/app/models/ipo";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Clock, FileText, User } from "lucide-react";
import Image from "next/image";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block">
      <Card className="h-full bg-background border border-muted/20 rounded-lg group-hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
        {/* Header Image */}
        <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
          {blog.image_url ? (
            <Image
              src={blog.image_url || ""}
              alt={blog.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-center">
              {/* Scoda Logo Placeholder */}
              <div className="w-24 h-16 mx-auto mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SCODA</span>
              </div>
              <p className="text-blue-400 text-xs font-medium tracking-wide">
                THE BRAND YOU CAN TRUST
              </p>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-3">
            <Badge
              variant="outline"
              className="text-xs font-medium px-2 py-1 border-blue-200 text-blue-600 bg-blue-50"
            >
              {blog.category || "IPO Analysis"}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(blog.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <CardTitle className="text-lg font-bold leading-tight text-slate-800 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </CardTitle>
          
          <CardDescription className="text-sm text-slate-600 line-clamp-3 mt-2">
            {blog.excerpt || blog.content.trim().split(" ").slice(0, 25).join(" ") + "..."}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
              Read More
              <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
            <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <User className="h-3 w-3" />
            <span>By {blog.author}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
