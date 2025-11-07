-- ====================================================
-- SQL VIEWS untuk Filtering Barang
-- ====================================================
-- File ini berisi SQL scripts untuk membuat database views
-- yang digunakan untuk filtering data barang
-- 
-- Cara menjalankan:
-- 1. Buka MySQL client atau phpMyAdmin
-- 2. Pilih database Anda
-- 3. Jalankan script di bawah ini satu per satu
-- ====================================================

-- VIEW 1: Menampilkan SEMUA barang (semua status: 0 dan 1)
-- View ini digunakan ketika filter = 'all'
-- Menggabungkan tabel barang dengan satuan untuk mendapatkan nama satuan
CREATE OR REPLACE VIEW view_barang_all AS
SELECT 
    b.idbarang,
    b.jenis,
    b.nama,
    b.status,
    b.harga,
    b.idsatuan,
    b.created_at,
    s.nama_satuan
FROM barang b
LEFT JOIN satuan s ON b.idsatuan = s.idsatuan
ORDER BY b.created_at DESC;

-- VIEW 2: Menampilkan HANYA barang AKTIF (status = 1)
-- View ini digunakan ketika filter = 'aktif'
-- Hanya menampilkan barang dengan status = 1 (Baik/Aktif)
CREATE OR REPLACE VIEW view_barang_aktif AS
SELECT 
    b.idbarang,
    b.jenis,
    b.nama,
    b.status,
    b.harga,
    b.idsatuan,
    b.created_at,
    s.nama_satuan
FROM barang b
LEFT JOIN satuan s ON b.idsatuan = s.idsatuan
WHERE b.status = 1  -- Filter hanya status aktif
ORDER BY b.created_at DESC;

-- ====================================================
-- Cara Menggunakan Views:
-- ====================================================
-- 1. Query semua barang:
--    SELECT * FROM view_barang_all;
-- 
-- 2. Query barang aktif saja:
--    SELECT * FROM view_barang_aktif;
--
-- 3. Views ini akan otomatis update ketika data di tabel barang berubah
-- ====================================================

-- ====================================================
-- Testing Views (Optional)
-- ====================================================
-- Test view_barang_all
SELECT 'Testing view_barang_all' as test;
SELECT COUNT(*) as total_semua_barang FROM view_barang_all;

-- Test view_barang_aktif  
SELECT 'Testing view_barang_aktif' as test;
SELECT COUNT(*) as total_barang_aktif FROM view_barang_aktif;

-- Bandingkan hasil
SELECT 
    (SELECT COUNT(*) FROM view_barang_all) as total_all,
    (SELECT COUNT(*) FROM view_barang_aktif) as total_aktif,
    (SELECT COUNT(*) FROM barang WHERE status = 0) as total_nonaktif;

-- ====================================================
-- Jika ingin menghapus views (tidak disarankan):
-- ====================================================
-- DROP VIEW IF EXISTS view_barang_all;
-- DROP VIEW IF EXISTS view_barang_aktif;
