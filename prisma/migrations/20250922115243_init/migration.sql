-- CreateTable
CREATE TABLE `tbl_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_barang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_barang` VARCHAR(255) NOT NULL,
    `harga` INTEGER NULL,
    `stok` INTEGER NOT NULL,
    `deskripsi` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_penjualan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_barang` INTEGER NOT NULL,
    `jumlah` DATE NULL,
    `qty` INTEGER NULL,
    `total` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_penjualan` ADD CONSTRAINT `tbl_penjualan_id_barang_fkey` FOREIGN KEY (`id_barang`) REFERENCES `tbl_barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
