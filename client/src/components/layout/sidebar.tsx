import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Search,
  FileText,
  BarChart2,
  Code2,
  LayoutDashboard,
  Target,
} from "lucide-react";

const links = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/keywords", icon: Search, label: "Keyword Research" },
  { href: "/content", icon: FileText, label: "Content Analyzer" },
  { href: "/seo-score", icon: BarChart2, label: "SEO Score" },
  { href: "/meta", icon: Code2, label: "Meta Generator" },
  { href: "/competitor", icon: Target, label: "Competitor Analysis" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-border/50 flex flex-col">
      <div className="p-6 border-b border-border/50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded blur-2xl" />
          <h1 className="relative text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SEO Tools
          </h1>
        </div>
      </div>
      <nav className="flex-1 py-4">
        {links.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}>
            <div
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all group relative cursor-pointer",
                location === href &&
                  "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
            >
              {location === href && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
              <Icon className={cn(
                "h-5 w-5 transition-transform",
                location === href ? "text-primary" : "text-muted-foreground",
                "group-hover:scale-110"
              )} />
              {label}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}