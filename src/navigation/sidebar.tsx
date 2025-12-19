export interface sidebarMenu {
  label: string;
  icon?: string;
  isActive?: boolean;
  url?: string;
  children?: sidebarMenu[];
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
    children: [
      {
        label: "Data Inventaris",
        url: "/inventory",
      },
      {
        label: "Riwayat",
        url: "/inventory/history",
      },
    ],
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
    children: [
      {
        label: "Pembayaran",
        url: "/monthly-money",
      },
      {
        label: "Charge",
        url: "/monthly-money/charge",
      },
    ],
  },
];
