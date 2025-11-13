# 📋 SISTEM INVENTORY - IMPROVEMENT DOCUMENTATION

**Tanggal Update:** 13 November 2025  
**Versi:** 2.0

---

## 🎯 RINGKASAN PERUBAHAN

Sistem inventory telah ditingkatkan dengan fokus pada:
1. **Integritas Data Transaksi** - Tidak ada edit/delete untuk transaksi
2. **Validasi yang Lebih Ketat** - Mencegah error dan inkonsistensi data
3. **User Experience** - Confirmation dialog dan feedback yang jelas
4. **Audit Trail** - Semua transaksi tersimpan permanen

---

## 🔐 PERUBAHAN KEBIJAKAN TRANSAKSI

### **Aturan Baru: NO EDIT, NO DELETE**

**Transaksi yang TIDAK BOLEH diedit/dihapus:**
- ✅ **Pengadaan** - Gunakan fitur "Batalkan" jika perlu membatalkan
- ✅ **Penerimaan** - Permanent record, hubungan dengan pengadaan
- ✅ **Penjualan** - Permanent record, sudah mengurangi stok

**Alasan:**
- **Audit Trail**: Semua transaksi harus dapat dilacak untuk audit
- **Integritas Stok**: Edit transaksi dapat menyebabkan stok tidak akurat
- **Compliance**: Standar akuntansi mengharuskan jejak transaksi lengkap
- **Keamanan**: Mencegah manipulasi data historis

**Master Data yang MASIH BISA diedit/dihapus:**
- ✅ Barang (jika belum ada transaksi)
- ✅ Vendor (jika belum ada transaksi)
- ✅ Satuan (jika belum ada transaksi)
- ✅ Margin (jika belum ada transaksi)
- ✅ User & Role

---

## 🔄 ALUR TRANSAKSI YANG BENAR

### **1. PENGADAAN (Purchase Order)**

```
┌─────────────────────────────────────────────┐
│ 1. User membuat Pengadaan                  │
│    - Pilih vendor                           │
│    - Input PPN (manual dalam rupiah)       │
│    - Tambah barang (idbarang, jumlah,      │
│      harga_satuan)                          │
│                                             │
│ 2. SP: sp_tambah_pengadaan                 │
│    - Insert ke tabel pengadaan             │
│    - Status = 'P' (Proses)                 │
│                                             │
│ 3. SP: sp_tambah_detail_pengadaan          │
│    - Insert detail (loop JSON)             │
│    - Hitung subtotal per item              │
│    - Update total pengadaan                │
│                                             │
│ 4. Status Pengadaan:                       │
│    - P = Diproses (belum ada penerimaan)   │
│    - S = Sebagian (ada penerimaan partial) │
│    - C = Selesai (semua sudah diterima)    │
│    - B = Batal (dibatalkan)                │
└─────────────────────────────────────────────┘
```

**Stored Procedures:**
- `sp_tambah_pengadaan(user_id, vendor_id, ppn_nilai, @out_id)`
- `sp_tambah_detail_pengadaan(pengadaan_id, item_count, details_json)`
- `sp_batal_pengadaan(pengadaan_id)` - Ubah status jadi 'B'

**Validasi:**
- Vendor harus aktif
- Barang harus aktif
- Harga satuan > 0
- Jumlah > 0
- PPN >= 0

---

### **2. PENERIMAAN (Goods Receipt)**

```
┌─────────────────────────────────────────────┐
│ 1. User membuat Penerimaan dari Pengadaan  │
│    - Pilih pengadaan (status P atau S)     │
│    - Input detail barang yang diterima     │
│    - Jumlah ≤ sisa yang belum diterima     │
│                                             │
│ 2. SP: sp_tambah_penerimaan                │
│    - Insert ke tabel penerimaan            │
│    - Hitung subtotal, PPN, total           │
│                                             │
│ 3. SP: sp_tambah_detail_penerimaan         │
│    - Insert detail penerimaan              │
│                                             │
│ 4. TRIGGER: trg_after_insert_detail_       │
│    penerimaan                               │
│    - Auto insert ke kartu_stok             │
│      (jenis_transaksi = 'M' untuk Masuk)   │
│    - Hitung stock baru                     │
│    - Update status pengadaan               │
│      (P → S → C)                           │
└─────────────────────────────────────────────┘
```

**Stored Procedures:**
- `sp_tambah_penerimaan(pengadaan_id, user_id, @out_id)`
- `sp_tambah_detail_penerimaan(penerimaan_id, item_count, details_json)`

**Trigger:**
- `trg_after_insert_detail_penerimaan` - Update kartu_stok & status pengadaan

**Validasi:**
- Pengadaan harus ada dan status P/S
- Detail harus sesuai dengan pengadaan
- Jumlah diterima ≤ (jumlah pesan - jumlah sudah diterima)

---

### **3. PENJUALAN (Sales)**

```
┌─────────────────────────────────────────────┐
│ 1. User membuat Penjualan                  │
│    - Pilih margin penjualan (aktif)        │
│    - Input PPN dalam persen (0-100%)       │
│    - Pilih barang (hanya yang stok > 0)    │
│    - Input jumlah (≤ stok tersedia)        │
│    - KONFIRMASI sebelum submit             │
│                                             │
│ 2. SP: sp_create_penjualan                 │
│    - Validasi stok untuk semua barang      │
│    - Hitung harga jual:                    │
│      = harga_beli + (margin%)              │
│    - Insert penjualan                      │
│    - Insert detail_penjualan               │
│    - Hitung subtotal                       │
│    - Hitung PPN rupiah:                    │
│      = subtotal × (ppn% / 100)             │
│    - Hitung total = subtotal + ppn_rupiah  │
│                                             │
│ 3. TRIGGER: trg_detail_penjualan_after_    │
│    insert                                   │
│    - Auto insert ke kartu_stok             │
│      (jenis_transaksi = 'K' untuk Keluar)  │
│    - Kurangi stock                         │
└─────────────────────────────────────────────┘
```

**Stored Procedures:**
- `sp_create_penjualan(margin_id, user_id, ppn_persen, details_json, @out_id)`

**Functions:**
- `fn_get_harga_jual_barang(idbarang, idmargin)` - Hitung selling price
- `fn_get_stok_tersedia(idbarang)` - Get current stock

**Trigger:**
- `trg_detail_penjualan_after_insert` - Update kartu_stok (keluar)

**Validasi:**
- Margin harus aktif (status = 1)
- Barang harus tersedia (stok > 0, status = 1)
- Jumlah jual ≤ stok tersedia
- Tidak boleh duplicate barang
- PPN 0-100%
- **KONFIRMASI** sebelum submit (tidak bisa undo!)

---

## 🆕 KOMPONEN BARU

### **1. ConfirmDialog Component**

```typescript
<ConfirmDialog
  isOpen={showConfirm}
  title="Konfirmasi Transaksi"
  message="Transaksi tidak dapat diedit/dihapus. Lanjutkan?"
  confirmText="Ya, Simpan"
  cancelText="Periksa Kembali"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  variant="info|warning|danger"
/>
```

**Digunakan di:**
- Penjualan Add - Konfirmasi sebelum submit
- (Future) Pengadaan Add - Konfirmasi PO
- (Future) Penerimaan Add - Konfirmasi goods receipt

---

### **2. Table Component - Transaction Mode**

```typescript
<Table
  data={transactions}
  columns={columns}
  idKey="idtransaksi"
  variant="blue"
  isTransaction={true}        // ← Aktifkan mode transaksi
  detailPath="/path/detail"   // ← View-only detail page
/>
```

**Fitur:**
- `isTransaction={true}` - Hilangkan tombol Edit & Delete
- `detailPath` - Tampilkan tombol "DETAIL" untuk view saja
- **NO EDIT, NO DELETE** untuk data transaksi

---

## 🔧 PERUBAHAN STORED PROCEDURE

### **sp_create_penjualan - PPN dari Persen ke Rupiah**

**BEFORE:**
```sql
IN p_ppn DECIMAL(15,2)  -- Input: Rp 50.000
SET v_total = v_subtotal + p_ppn
```

**AFTER:**
```sql
IN p_ppn DECIMAL(5,2)   -- Input: 11 (untuk 11%)
SET v_ppn_nilai = v_subtotal * (p_ppn / 100)
SET v_total = v_subtotal + v_ppn_nilai
```

**Contoh:**
- Subtotal: Rp 1.000.000
- PPN input: 11 (11%)
- PPN rupiah: Rp 1.000.000 × 0.11 = Rp 110.000
- Total: Rp 1.110.000

---

### **Status Field Fix - TINYINT vs CHAR**

**MASALAH:**
```sql
-- ❌ SALAH - Mencoba compare string dengan tinyint
WHERE status = 'A'   -- MySQL error: Truncated incorrect DOUBLE value: 'A'
```

**SOLUSI:**
```sql
-- ✅ BENAR - Compare dengan integer
WHERE status = 1     -- 1 = Active, 0 = Inactive
```

**Tabel yang terpengaruh:**
- `margin_penjualan.status` → TINYINT (1/0)
- `barang.status` → TINYINT (1/0)
- `vendor.status` → TINYINT (1/0)
- `pengadaan.status` → CHAR(1) ('P'/'S'/'C'/'B') ← Ini beda!

---

## 📊 VIEW BARU

### **view_margin_aktif**
```sql
CREATE VIEW view_margin_aktif AS
SELECT * FROM margin_penjualan
WHERE status = 1  -- Active margins only
ORDER BY persen;
```

### **view_penjualan**
```sql
CREATE VIEW view_penjualan AS
SELECT 
    p.idpenjualan,
    p.created_at,
    p.subtotal_nilai,
    p.ppn,
    p.total_nilai,
    m.persen as margin_persen,
    u.nama as nama_user
FROM penjualan p
LEFT JOIN margin_penjualan m ON p.idmargin_penjualan = m.idmargin_penjualan
LEFT JOIN user u ON p.iduser = u.iduser
ORDER BY p.created_at DESC;
```

---

## ✅ CHECKLIST IMPLEMENTASI

### **SQL Changes**
- [x] Fix `fn_get_harga_jual_barang` - status = 1
- [x] Fix `view_barang_tersedia` - status = 1
- [x] Update `sp_create_penjualan` - PPN persen → rupiah
- [x] Create `view_margin_aktif`
- [x] Create `view_penjualan`
- [x] Update dokumentasi SQL testing

### **Frontend Changes**
- [x] Create `ConfirmDialog` component
- [x] Update `Table` component - support transaction mode
- [x] Update `penjualan/page.tsx` - isTransaction=true
- [x] Update `penjualan/add/page.tsx` - PPN persen, confirmation
- [x] Update `pengadaan/page.tsx` - remove edit/delete

### **Validation Improvements**
- [x] PPN validation (0-100%)
- [x] Stock validation sebelum penjualan
- [x] Duplicate barang check
- [x] Loading states & error messages
- [x] Empty state warnings

### **TODO - Future Improvements**
- [ ] Create detail pages (view-only):
  - `pengadaan/detail/[id]/page.tsx`
  - `penerimaan/detail/[id]/page.tsx`
  - `penjualan/detail/[id]/page.tsx`
- [ ] Add print functionality untuk invoice
- [ ] Add export to Excel/PDF
- [ ] Add date range filter untuk transaksi
- [ ] Add dashboard dengan summary statistics
- [ ] Add notification system untuk low stock

---

## 🚀 CARA APPLY CHANGES

### **1. Update Database**
```bash
# Apply SQL procedures
mysql -u root -p proyekpemweb < database/views/margin_views.sql
mysql -u root -p proyekpemweb < database/procedures/penjualan_procedures.sql
```

### **2. Restart Dev Server**
```bash
npm run dev
```

### **3. Testing**
1. Test margin aktif: `/api/penjualans/margins`
2. Test barang tersedia: `/api/penjualans/barang-tersedia`
3. Create penjualan: `/penjualan/add`
4. Verify kartu_stok updated

---

## 📞 SUPPORT

Jika ada masalah atau pertanyaan:
1. Check terminal logs untuk error SQL
2. Check browser console untuk frontend errors
3. Verify database views & procedures sudah ter-apply
4. Check `status` column type di database (harus TINYINT, bukan CHAR)

---

**END OF DOCUMENTATION**
