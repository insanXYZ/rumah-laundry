-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Waktu pembuatan: 12 Des 2025 pada 01.42
-- Versi server: 9.4.0
-- Versi PHP: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rumah_laundry`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT (now())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$NCPkgosbATsOcZ/Q/9EJbOnjpIiXRa2rzXQffqo3tYt8JU.EN6Kiq', '2025-12-07 12:14:53');

-- --------------------------------------------------------

--
-- Struktur dari tabel `charge_santries`
--

CREATE TABLE `charge_santries` (
  `id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `payed` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `class` varchar(50) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `number_phone` varchar(20) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `customers`
--

INSERT INTO `customers` (`id`, `name`, `class`, `type`, `number_phone`, `address`, `created_at`) VALUES
(1, 'rafi', '12', 'santri', '08982147', NULL, '2025-12-08 00:53:20'),
(2, 'rehan', '13', 'santri', '721731', NULL, '2025-12-08 00:53:30'),
(3, 'iwan', NULL, 'umum', '38213781', 'ndsajda', '2025-12-08 04:58:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `inventories`
--

CREATE TABLE `inventories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `inventories`
--

INSERT INTO `inventories` (`id`, `name`, `created_at`, `deleted_at`) VALUES
(3, 'gas 3kg', '2025-12-11 17:49:58', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `inventory_stock`
--

CREATE TABLE `inventory_stock` (
  `id` int NOT NULL,
  `inventory_id` int NOT NULL,
  `stock` int NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `price` int DEFAULT '0',
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `inventory_stock`
--

INSERT INTO `inventory_stock` (`id`, `inventory_id`, `stock`, `created_at`, `price`, `description`) VALUES
(4, 3, 3, '2025-12-11 17:49:58', 15000, 'inventaris baru');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `customer_id` int NOT NULL,
  `status` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `status`, `created_at`) VALUES
(31, 3, 'beres', '2025-12-11 16:56:03'),
(32, 3, 'beres', '2025-12-12 01:13:07'),
(33, 3, 'beres', '2025-12-12 01:25:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `total_price`, `created_at`) VALUES
(40, 31, 2, 1.00, 6000, 6000, '2025-12-11 16:56:03'),
(41, 32, 3, 10.00, 5000, 50000, '2025-12-12 01:13:07'),
(42, 33, 8, 10.00, 25000, 250000, '2025-12-12 01:25:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `unit` varchar(10) NOT NULL,
  `price` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT (now())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `name`, `unit`, `price`, `created_at`) VALUES
(1, 'Pakaian santri', 'kg', 5000, '2025-12-08 01:25:40'),
(2, 'Pakaian - cuci', 'kg', 6000, '2025-12-08 01:26:38'),
(3, 'Pakaian - setrika', 'kg', 5000, '2025-12-08 01:27:05'),
(4, 'Pakaian - cuci setrika', 'kg', 7000, '2025-12-08 01:27:27'),
(5, 'Selimut besar', 'kg', 20000, '2025-12-08 01:28:40'),
(6, 'Selimut kecil', 'kg', 10000, '2025-12-08 01:28:51'),
(7, 'Selimut sedang', 'kg', 15000, '2025-12-08 01:29:01'),
(8, 'Selimut extra besar', 'kg', 25000, '2025-12-08 01:29:15'),
(9, 'Bed cover besar', 'kg', 20000, '2025-12-08 01:29:26'),
(10, 'Bed cover kecil', 'kg', 10000, '2025-12-08 01:29:41'),
(11, 'Bed cover sedang', 'kg', 15000, '2025-12-08 01:29:52'),
(12, 'Bed cover extra besar', 'kg', 25000, '2025-12-08 01:30:10'),
(13, 'Seprei 1 set', 'pcs', 10000, '2025-12-08 01:30:46'),
(14, 'Seprei', 'pcs', 8000, '2025-12-08 01:30:59'),
(15, 'Boneka kecil', 'pcs', 5000, '2025-12-08 01:31:17'),
(16, 'Boneka sedang', 'pcs', 10000, '2025-12-08 01:31:27'),
(17, 'Boneka besar', 'pcs', 15000, '2025-12-08 01:31:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `santri_monthly_moneys`
--

CREATE TABLE `santri_monthly_moneys` (
  `id` int NOT NULL,
  `customer_id` int NOT NULL,
  `amount` int NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `santri_monthly_moneys`
--

INSERT INTO `santri_monthly_moneys` (`id`, `customer_id`, `amount`, `created_at`, `type`) VALUES
(3, 1, 140000, '2025-12-08 02:02:53', 'cuci setrika');

-- --------------------------------------------------------

--
-- Struktur dari tabel `__drizzle_migrations`
--

CREATE TABLE `__drizzle_migrations` (
  `id` bigint UNSIGNED NOT NULL,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `__drizzle_migrations`
--

INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES
(1, '72df1adaa760918c991a7a39afbbbb51613264afd6d104d72bb4416f7cf43243', 1765109685665),
(2, 'a1d04e427553d6d949b439da84a2d50405018c4cb32a3535b7d9ccdb5455d7be', 1765154099305),
(3, '58356e129ae4f82d89187a9082f190bd2f903797751d2e22a129068dae5fdc00', 1765171005516),
(4, '34f9de96f5877e626acc588e59a471c359a7c61049387eee372072ba2fe96fab', 1765293696331),
(5, 'd3979225dc3b68ee860a8c354a0b3ccd4e996b3728d660f03fd84396f6b80d6f', 1765295235009),
(6, '7104afcf38ef4a7869783e07e2de6f0af10d772e9478bc4d782ae43d3b9eebc2', 1765327420538),
(7, 'bd6d21930e56f94652cc6cd51102286c035e8c9bdf6e00a752bb65aac1ff4747', 1765327578792),
(8, '7ede46313f3236c0f900101a647d55ed4e5b3932139ef3885dd5d378ca811976', 1765372754744),
(9, 'cad5df3b92d170e5842dd58e6db8a5e55eca65591a95833740efb6af8fd9195b', 1765372784499),
(10, '86ff8cf359db1d2a48eb5c1e18f874e3313b8a110f4fd8a52fb88999f52dce51', 1765373171639),
(11, '1ae673f26132f9b2c33f0cd9049e86f39e2d7e06ac58f1b9b03e70dd795add5e', 1765373349287);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- Indeks untuk tabel `charge_santries`
--
ALTER TABLE `charge_santries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `charge_santries_customer_id_customers_id_fk` (`customer_id`);

--
-- Indeks untuk tabel `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `inventories`
--
ALTER TABLE `inventories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `inventory_stock`
--
ALTER TABLE `inventory_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_stock_inventory_id_inventories_id_fk` (`inventory_id`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_customer_id_customers_id_fk` (`customer_id`);

--
-- Indeks untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_orders_id_fk` (`order_id`),
  ADD KEY `order_items_product_id_products_id_fk` (`product_id`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `santri_monthly_moneys`
--
ALTER TABLE `santri_monthly_moneys`
  ADD PRIMARY KEY (`id`),
  ADD KEY `santri_monthly_moneys_customer_id_customers_id_fk` (`customer_id`);

--
-- Indeks untuk tabel `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `charge_santries`
--
ALTER TABLE `charge_santries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `inventories`
--
ALTER TABLE `inventories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `inventory_stock`
--
ALTER TABLE `inventory_stock`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT untuk tabel `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `santri_monthly_moneys`
--
ALTER TABLE `santri_monthly_moneys`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `__drizzle_migrations`
--
ALTER TABLE `__drizzle_migrations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `charge_santries`
--
ALTER TABLE `charge_santries`
  ADD CONSTRAINT `charge_santries_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `inventory_stock`
--
ALTER TABLE `inventory_stock`
  ADD CONSTRAINT `inventory_stock_inventory_id_inventories_id_fk` FOREIGN KEY (`inventory_id`) REFERENCES `inventories` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `santri_monthly_moneys`
--
ALTER TABLE `santri_monthly_moneys`
  ADD CONSTRAINT `santri_monthly_moneys_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
