/**
 * ========================================================
 * CẤU HÌNH DẢI NGÂN HÀ 3D (GALAXY LOVE)
 * ========================================================
 */

// Lấy danh sách ảnh Base64 offline an toàn chống lỗi CORS / màn hình đen trên file:///
const _ASSETS = window.PHOTO_ASSETS || {};

// 1. DANH SÁCH ẢNH BAY QUANH DẢI NGÂN HÀ TỪ THƯ MỤC assets/galaxy/:
// - Tự động ưu tiên ảnh Base64 để chạy mượt 100% offline không bị lỗi hộp vuông đen
// - Tự động đồng bộ với 6 ảnh trong thư mục assets/galaxy/
window.GALAXY_PHOTOS = [
  _ASSETS.image || "assets/galaxy/image.png",
  _ASSETS.image1 || "assets/galaxy/image1.png",
  _ASSETS.image2 || "assets/galaxy/image2.png",
  _ASSETS.image3 || "assets/galaxy/image3.png",
  _ASSETS.image4 || "assets/galaxy/image4.png",
  _ASSETS.image5 || "assets/galaxy/image5.png"
];

// 2. CÁC DÒNG CHỮ CHẠY QUANH HÀNH TINH TRUNG TÂM:
window.GALAXY_TEXTS = [
  "happy birthday",
  "Chị Trinh",
];

// 3. TRANG TIẾP THEO KHI CHẠM VÀO HÀNH TINH (MỞ MÓN QUÀ TIẾP THEO):
window.NEXT_PAGE_AFTER_GALAXY = "dlove.html";

// 4. THỜI GIAN NGẮM DẢI NGÂN HÀ TRƯỚC KHI BẮT BUỘC PHÓNG TO TỚI HÀNH TINH (giây):
// Sau 6 giây ngắm toàn cảnh dải ngân hà, máy quay sẽ tự động phóng to sát hành tinh
window.TIME_BEFORE_PLANET_ZOOM = 6;
