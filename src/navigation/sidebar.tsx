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
    icon: "tabler:transaction-dollar",
    url: "/order",
  },
  {
    label: "Inventaris",
    icon: "material-symbols:inventory-rounded",
    url: "/inventory",
  },
  {
    label: "Pelanggan",
    icon: "carbon:customer",
    url: "/customer",
  },
  {
    label: "Daftar Layanan",
    icon: "fluent-mdl2:product",
    url: "/service-list",
  },
  {
    label: "Bulanan Santri",
    icon: "material-symbols:finance-chip-outline",
    url: "/monthly-money",
  },
];
