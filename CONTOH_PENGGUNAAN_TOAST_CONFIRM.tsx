// CONTOH PENGGUNAAN TOAST DAN CONFIRM DIALOG
// =============================================

// 1. Import komponen dan hooks yang diperlukan
import { Toast } from '@/app/components/Toast';
import { ConfirmDialog } from '@/app/components/ConfirmDialog';
import { useToast } from '@/app/hooks/useToast';
import { useConfirm } from '@/app/hooks/useConfirm';

// 2. Di dalam component, inisialisasi hooks
export default function MyComponent() {
  const { toast, hideToast, success, error, warning, info } = useToast();
  const { confirmState, showConfirm, hideConfirm, handleConfirm } = useConfirm();

  // 3. Gunakan Toast untuk notifikasi sederhana
  const handleSave = async () => {
    try {
      // ... proses save
      success('Data berhasil disimpan!'); // Toast hijau
    } catch (err) {
      error('Gagal menyimpan data'); // Toast merah
    }
  };

  const handleWarningCase = () => {
    warning('Perhatian: Data akan diubah'); // Toast kuning
  };

  const handleInfoCase = () => {
    info('Informasi telah diperbarui'); // Toast biru/teal
  };

  // 4. Gunakan ConfirmDialog untuk konfirmasi aksi penting
  const handleDelete = (id: number) => {
    showConfirm(
      'Hapus Data',
      'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
      () => {
        // Callback yang akan dijalankan jika user klik "Ya"
        deleteData(id);
      },
      'danger' // variant: 'danger' | 'warning' | 'info'
    );
  };

  const deleteData = async (id: number) => {
    try {
      // ... proses delete
      success('Data berhasil dihapus');
    } catch (err) {
      error('Gagal menghapus data');
    }
  };

  // 5. Render komponen Toast dan ConfirmDialog di akhir JSX
  return (
    <div>
      {/* Konten halaman Anda */}
      
      <button onClick={handleSave}>Simpan</button>
      <button onClick={() => handleDelete(1)}>Hapus</button>

      {/* Toast - tampil di pojok kanan atas */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
        duration={3000} // opsional, default 3000ms
      />

      {/* ConfirmDialog - modal konfirmasi */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        variant={confirmState.variant}
        confirmText="Ya"
        cancelText="Batal"
        onConfirm={handleConfirm}
        onCancel={hideConfirm}
      />
    </div>
  );
}

// MENGGANTI ALERT() BROWSER
// =========================
// ❌ JANGAN: alert('Berhasil disimpan');
// ✅ GUNAKAN: success('Berhasil disimpan');

// ❌ JANGAN: alert('Error: ' + error);
// ✅ GUNAKAN: error('Gagal menyimpan data');

// ❌ JANGAN: if (confirm('Hapus data?')) { deleteData(); }
// ✅ GUNAKAN: showConfirm('Hapus Data', 'Yakin hapus?', () => deleteData(), 'danger');

// VARIANT YANG TERSEDIA
// ======================
// Toast variants: 'success', 'error', 'warning', 'info'
// ConfirmDialog variants: 'danger', 'warning', 'info'

// TIPS
// ====
// - Toast akan otomatis hilang setelah 3 detik (bisa diubah dengan prop duration)
// - Toast bisa ditutup manual dengan klik tombol X
// - ConfirmDialog tidak akan hilang sampai user klik salah satu tombol
// - Gunakan variant 'danger' untuk aksi destructive (hapus, batalkan, dll)
// - Gunakan variant 'warning' untuk aksi yang perlu perhatian
// - Gunakan variant 'info' untuk informasi umum
