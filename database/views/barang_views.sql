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
WHERE b.status = 1
ORDER BY b.created_at DESC;

















SELECT 'Testing view_barang_all' as test;
SELECT COUNT(*) as total_semua_barang FROM view_barang_all;


SELECT 'Testing view_barang_aktif' as test;
SELECT COUNT(*) as total_barang_aktif FROM view_barang_aktif;


SELECT
    (SELECT COUNT(*) FROM view_barang_all) as total_all,
    (SELECT COUNT(*) FROM view_barang_aktif) as total_aktif,
    (SELECT COUNT(*) FROM barang WHERE status = 0) as total_nonaktif;