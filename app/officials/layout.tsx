"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export default function OfficialsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // e.g., "/officials/residents/add"
  const segments = pathname.split("/").filter(Boolean); // ["officials","residents","add"]

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        {/* Breadcrumb Header */}
        <header className="flex h-16 items-center gap-2 px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((segment, idx) => {
                const isLast = idx === segments.length - 1;
                const href = "/" + segments.slice(0, idx + 1).join("/");
                return (
                  <span key={href} className="flex items-center">
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{segment.replace(/-/g, " ")}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={href}>{segment.replace(/-/g, " ")}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>

                    {/* Add separator except for the last item */}
                    {!isLast && <BreadcrumbSeparator />}
                  </span>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main content */}
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
