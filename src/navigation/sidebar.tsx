interface sidebarMenu {
  label: string;
  icon: string;
  url: string;
}

export const navigation: sidebarMenu[] = [
  {
    label: "Dashboard",
    icon: "lucide:layout-dashboard",
    url: "/dashboard",
  },
  {
    label: "Order",
    icon: "lucide:layout-dashboard",
    url: "/order",
  },
  {
    label: "Inventory",
    icon: "lucide:layout-dashboard",
    url: "/inventory",
  },
  {
    label: "Santri",
    icon: "lucide:layout-dashboard",
    url: "/santri",
  },
];
