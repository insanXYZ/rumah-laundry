"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { navigation, sidebarMenu } from "@/navigation/sidebar";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/sidebar/user-menu";
import Image from "next/image";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Minus, Plus } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const findMenuByPath = (
    menus: sidebarMenu[],
    pathname: string
  ): sidebarMenu | null => {
    for (const menu of menus) {
      if (menu.url === pathname) {
        return menu;
      }

      if (menu.children) {
        const found = findMenuByPath(menu.children, pathname);
        if (found) return found;
      }
    }
    return null;
  };

  const breadLabel = React.useMemo(() => {
    return findMenuByPath(navigation, pathname)?.label ?? "";
  }, [pathname]);

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex justify-center w-full">
                <Image src={"/logo.svg"} alt="logo" width={100} height={200} />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarMenu>
              {navigation.map((item) => {
                if (!item.children) {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url!}>
                          <Icon icon={item.icon} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                } else {
                  return (
                    <Collapsible
                      key={item.label}
                      asChild
                      defaultOpen={item.isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem key={item.label}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.label}
                            className="cursor-pointer"
                          >
                            <div>
                              <Icon icon={item.icon} />
                              <span>{item.label}</span>
                              <ChevronRight className="ml-auto group-data-[state=open]/collapsible:rotate-90" />
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {item.children.length ? (
                          <>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.children?.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.label}>
                                    <SidebarMenuSubButton asChild>
                                      <Link href={subItem.url!}>
                                        <span>{subItem.label}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </>
                        ) : null}
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserMenu />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="py-4 pt-0 px-20">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
