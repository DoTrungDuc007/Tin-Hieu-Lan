/* Dữ liệu trang – nội dung lấy từ "SÁNG KIẾN 2026.docx"
   (Nghiên cứu, xây dựng bộ ký hiệu trong thông tin liên lạc phục vụ tìm kiếm cứu nạn dưới nước
   của lực lượng Cảnh sát PCCC và CNCH — bản thảo tháng 10/2026, đối chiếu nguồn đến 04/10/2026).
   Đây là bản thảo nghiên cứu, CHƯA PHẢI bộ ký hiệu đã thẩm định/ban hành chính thức.

   CATEGORIES: 4 danh mục lớn hiện ở khối "Danh mục" (bên trái) — mỗi mục là { name, children }.
   "Bộ ký hiệu tay" có 8 danh mục con (đúng thứ tự "Nhóm 1..8" trong tài liệu, nhưng đã bỏ tiền
   tố "Nhóm N. " khi hiển thị): chọn danh mục cha thì lọc theo TẤT CẢ danh mục con (gộp cả 8
   nhóm); bấm mũi tên cạnh tên cha để sổ ra 8 danh mục con rồi chọn riêng một nhóm thì danh sách
   chỉ còn đúng nhóm đó. "Bộ ký hiệu dây"/"ánh sáng"/"Vỗ vai và bóp tay" không có con
   (children: []), tự thân chúng đã là danh mục để lọc.
   Trường "categories" của mỗi bài vẫn ghi đúng tên danh mục mà bài đó thuộc về: bài ký hiệu
   tay ghi tên danh mục con (ví dụ "Thiết lập liên lạc và xác nhận" — PHẢI khớp y hệt một phần
   tử trong children ở trên), bài dây/ánh sáng/tiếp xúc ghi thẳng tên danh mục lớn tương ứng —
   KHÔNG ghi "Bộ ký hiệu tay" vào bài nào, vì đó chỉ là danh mục cha dùng để gộp lọc.

   POSTS: mỗi bài là MỘT ký hiệu (mã T/D/A/X theo đúng tài liệu gốc), gồm:
   id, title ("Mã. Tên ký hiệu"), excerpt (tóm tắt ngắn), content (mảng đoạn văn —
   mỗi đoạn giữ nguyên nhãn gốc như "Thực hiện:", "Ý nghĩa:", "Gửi xuống:"…),
   categories (danh mục để lọc), tags (nhóm lớn: Ký hiệu tay/dây/ánh sáng/tiếp xúc, + mã),
   author, date (YYYY-MM-DD), readTime (phút), icon (emoji dự phòng),
   colors [màu1, màu2] (nền dự phòng khi chưa có ảnh),
   path (đường dẫn ảnh minh họa của đúng mục đó, ví dụ "images/T01.jpeg";
   năm mục A04–A08 dùng chung một sơ đồ "images/anh-sang-chieu-tay.png"
   vì tài liệu gốc mô tả chúng bằng cách chiếu đèn vào ký hiệu tay có sẵn, không vẽ hình riêng).

   author/date dùng chung một giá trị đại diện cho cả tài liệu (không có tên/ngày riêng
   cho từng ký hiệu trong bản gốc) — nên thay bằng tên/ngày thật nếu tài liệu được ban hành. */
const CATEGORIES = [
  {
    name: "Bộ ký hiệu tay",
    children: [
      "Thiết lập liên lạc và xác nhận",
      "Điều khiển di chuyển",
      "Phối hợp với đồng đội",
      "Theo dõi thời gian và điều hành nhiệm vụ",
      "Kiểm tra và thông báo áp suất khí",
      "Tình trạng cơ thể và cân bằng áp suất",
      "Cảnh báo nguy hiểm và sự cố khí thở",
      "Liên lạc trên mặt nước",
    ],
  },
  { name: "Bộ ký hiệu dây", children: [] },
  { name: "Bộ ký hiệu ánh sáng", children: [] },
  { name: "Vỗ vai và bóp tay", children: [] },
];

/* SURVEY_INFO: nội dung popup tĩnh "Khảo sát & Thử nghiệm" mở từ nút trên header (mục 2.2.3 và phần
   "Đánh giá và khả năng áp dụng" của tài liệu gốc). title là tiêu đề lớn trong popup; mỗi phần tử của
   sections là một mục lớn, có "heading" + "paragraphs" (đoạn văn thẳng) HOẶC "heading" + "subsections"
   (các mục con, mỗi mục con có "subheading" + "paragraphs"). */
const SURVEY_INFO = {
  title: "Khảo sát và thử nghiệm",
  sections: [
    {
      heading: "Tổ chức khảo sát và thử nghiệm",
      paragraphs: [
        "Giai đoạn một là khảo sát trước huấn luyện. Người tham gia giải nghĩa độc lập các hình và nhịp mô phỏng, không được xem đáp án trước. Kết quả ghi rõ mã ký hiệu, nghĩa người trả lời, nguồn đã học và mức tự tin. Chỉ mô tả thực trạng trong phạm vi mẫu khảo sát; không suy rộng thành kết luận toàn lực lượng khi mẫu chưa đại diện.",
        "Giai đoạn hai là thẩm định nội dung bởi cán bộ có chuyên môn lặn và huấn luyện. Hội đồng rà soát các cặp dễ nhầm; kiểm tra chiều truyền tin của bảng dây; lựa chọn hoặc loại bỏ đề xuất vỗ vai; kiểm tra việc thể hiện các bộ phận trang bị. Ghi rõ người duyệt, phiên bản tài liệu, nội dung sửa và lý do.",
        "Giai đoạn ba là thử nhận diện trên cạn: người phát thực hiện theo phiếu ngẫu nhiên, người nhận ghi nghĩa trước khi đối chiếu. Tín hiệu dây và xúc giác được thử khi không nhìn thấy thao tác phát, nhưng vẫn trong điều kiện trên cạn do người huấn luyện kiểm soát. Cần thử cả khi mang găng và cấu hình trang bị dự kiến.",
        "Giai đoạn bốn là thực hành dưới nước có kiểm soát theo kế hoạch được đơn vị phê duyệt, với người phụ trách và phương án bảo đảm tương ứng. Thử từng biến như khoảng cách, ánh sáng hoặc kiểu găng; không thay đổi đồng thời nhiều điều kiện rồi quy kết lỗi cho một yếu tố. Không cố tạo thiếu khí, mắc thật hoặc mất liên lạc không kiểm soát chỉ để thử ký hiệu.",
        "Khi người nhận hiểu sai tín hiệu khẩn cấp, không duy trì được liên lạc cần thiết hoặc xuất hiện tình huống ngoài kế hoạch, dừng bài thử và xử lý theo phương án bảo đảm. Nội dung pháp lý nước ngoài như OSHA 1910.422 [13] chỉ được tham khảo về nguyên tắc kiểm soát liên lạc, không thay quy trình nghiệp vụ áp dụng tại đơn vị.",
      ],
    },
    {
      heading: "Đánh giá và khả năng áp dụng",
      subsections: [
        {
          subheading: "Chỉ số đánh giá và nguyên tắc xử lý kết quả",
          paragraphs: [
            "Tỷ lệ nhận đúng được tính bằng số lượt giải nghĩa đúng chia cho tổng lượt hợp lệ của từng mã. Thời gian nhận biết tính từ khi bắt đầu phát đến khi người nhận xác nhận đúng; ghi riêng lượt sai hoặc không phản hồi, không loại chúng chỉ để làm đẹp thời gian trung bình.",
            "Ghi riêng nhận đúng nghĩa và thực hiện đúng phản hồi. Ma trận nhầm lẫn đặt mã phát ở hàng, mã người nhận hiểu ở cột; ô ngoài đường chéo chỉ cặp cần sửa. Với mẫu nhỏ, trình bày số lượt cùng tỷ lệ.",
            "Các chỉ tiêu chấp nhận phải được xác định trước thử nghiệm. Bản thảo đề xuất nguyên tắc không chấp nhận nhầm tín hiệu hết khí, nguy cấp hoặc dừng trong bài đánh giá cuối; đây là yêu cầu thẩm định đề xuất, không phải kết quả đã đạt hay tiêu chuẩn pháp lý. Nếu xuất hiện một lỗi nguy hiểm, phải phân tích và kiểm tra lại sau hiệu chỉnh.",
          ],
        },
        {
          subheading: "Sản phẩm và khả năng áp dụng",
          paragraphs: [
            "Sản phẩm gồm 54 phiếu có hình hoặc sơ đồ: 26 tay, 13 dây, 10 ánh sáng và 5 tiếp xúc, phục vụ thảo luận chuyên môn và chuẩn bị khảo sát. Trước khi làm thẻ hiện trường, cần duyệt danh mục, hoàn thiện ảnh, kiểm tra bản in và huấn luyện cả người lặn lẫn người bảo đảm.",
            "Tính mới đề xuất là cách thống nhất hình, nghĩa, chiều truyền tin, phản hồi và giới hạn; rà soát xung đột hệ mã; dùng cùng phiếu để huấn luyện và đánh giá. Không coi động tác phổ biến vốn có là phát minh mới.",
            "Hiệu quả dự kiến là giảm khả năng hiểu khác nhau, thuận lợi hơn cho kiểm tra kỹ năng và quản lý phiên bản. Chưa có cơ sở để công bố mức giảm thời gian, tỷ lệ giảm sự cố hoặc số tiền tiết kiệm. Những kết luận định lượng chỉ được bổ sung sau thu thập và phân tích dữ liệu thật.",
          ],
        },
      ],
    },
  ],
};

const POSTS = [
  {
    "id": 1,
    "title": "T01. Nhìn tôi / Chú ý tín hiệu",
    "excerpt": "Yêu cầu chuyển sự chú ý đến thông tin tiếp theo.",
    "content": [
      "Thực hiện: Đưa ngón trỏ và ngón giữa về phía kính mặt nạ, rồi chỉ người hoặc vị trí cần quan sát.",
      "Ý nghĩa: Yêu cầu chuyển sự chú ý đến thông tin tiếp theo.",
      "Phản hồi: Nhìn đúng vị trí chỉ dẫn và tiếp nhận thông điệp.",
      "Phân biệt: Tránh chạm mạnh làm xê dịch mặt nạ."
    ],
    "categories": ["Thiết lập liên lạc và xác nhận"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-01",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/T01.jpeg"
  },
  {
    "id": 2,
    "title": "T02. Tôi ổn / Bạn có ổn không?",
    "excerpt": "Hỏi tình trạng hoặc báo tình trạng ổn.",
    "content": [
      "Thực hiện: Ngón cái chạm ngón trỏ thành vòng tròn; đưa bàn tay vào vùng nhìn thấy của đồng đội.",
      "Ý nghĩa: Hỏi tình trạng hoặc báo tình trạng ổn.",
      "Phản hồi: Ra lại tín hiệu “Tôi ổn” nếu bình thường; nếu có vấn đề, phát tín hiệu tương ứng và chỉ vị trí gặp sự cố.",
      "Lưu ý: Không dùng ngón cái hướng lên để báo “Tôi ổn”."
    ],
    "categories": ["Thiết lập liên lạc và xác nhận"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-01",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/T02.jpeg"
  },
  {
    "id": 3,
    "title": "T03. Tôi ổn — biến thể khi đeo găng tay dày",
    "excerpt": "Hỏi tình trạng hoặc báo tình trạng ổn.",
    "content": [
      "Thực hiện: Chụm đầu ngón cái và ngón trỏ tạo thành vòng tròn; ba ngón còn lại để co tự nhiên khi găng tay dày gây khó duỗi. Đưa bàn tay vào vùng nhìn thấy của đồng đội.",
      "Ý nghĩa: Hỏi tình trạng hoặc báo tình trạng ổn.",
      "Phản hồi: Ra lại tín hiệu “Tôi ổn” nếu bình thường; nếu có vấn đề, phát tín hiệu tương ứng và chỉ vị trí gặp sự cố.",
      "Lưu ý: Cần thể hiện rõ vòng tròn giữa ngón cái và ngón trỏ, tránh nhầm với nắm tay kín. Không dùng ngón cái hướng lên để báo “Tôi ổn”."
    ],
    "categories": ["Thiết lập liên lạc và xác nhận"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-02",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/T03.jpeg"
  },
  {
    "id": 4,
    "title": "T04. Tôi không hiểu",
    "excerpt": "Báo chưa hiểu thông tin vừa nhận.",
    "content": [
      "Thực hiện: Mở hai bàn tay sang hai bên, lòng bàn tay hướng lên; thể hiện rõ yêu cầu làm rõ.",
      "Ý nghĩa: Báo chưa hiểu thông tin vừa nhận.",
      "Phản hồi: Người phát nhắc lại rõ hơn hoặc chuyển cách truyền tin.",
      "Lưu ý: Không thực hiện lệnh khi chưa giải nghĩa được."
    ],
    "categories": ["Thiết lập liên lạc và xác nhận"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-05",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/T04.jpeg"
  },
  {
    "id": 5,
    "title": "T05. Có sự cố / Có vấn đề",
    "excerpt": "Thông báo có tình trạng bất thường cần chú ý.",
    "content": [
      "Thực hiện: Duỗi phẳng bàn tay, lòng bàn tay úp, các ngón hơi tách; nghiêng bàn tay luân phiên sang hai bên quanh trục cẳng tay, sau đó chỉ vị trí có vấn đề.",
      "Ý nghĩa: Thông báo có tình trạng bất thường cần chú ý.",
      "Phản hồi: Chú ý người phát tín hiệu, xác định vấn đề và phối hợp hỗ trợ.",
      "Lưu ý: Nghiêng bàn tay quanh trục cẳng tay, khác với chuyển cả bàn tay qua lại theo phương ngang của tín hiệu “giữ độ sâu”"
    ],
    "categories": ["Thiết lập liên lạc và xác nhận"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-06",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/T05.jpeg"
  },
  {
    "id": 6,
    "title": "T06. Dừng lại — một tay",
    "excerpt": "Dừng hoạt động đang thực hiện để nhận thông tin tiếp theo.",
    "content": [
      "Thực hiện: Đưa bàn tay thẳng đứng, các ngón hướng lên, lòng bàn tay hướng về người nhận.",
      "Ý nghĩa: Dừng hoạt động đang thực hiện để nhận thông tin tiếp theo.",
      "Phản hồi: Dừng có kiểm soát và xác nhận đã nhận lệnh.",
      "Lưu ý: Chọn một dạng dừng này; không đưa đồng thời hai dạng dừng trong ảnh gốc vào bài kiểm tra."
    ],
    "categories": ["Điều khiển di chuyển"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-06",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/T06.jpeg"
  },
  {
    "id": 7,
    "title": "T07. Chậm lại / Bình tĩnh",
    "excerpt": "Yêu cầu giảm nhịp thao tác hoặc tốc độ di chuyển.",
    "content": [
      "Thực hiện: Duỗi bàn tay, lòng bàn tay úp; chuyển chậm lên xuống với biên độ nhỏ.",
      "Ý nghĩa: Yêu cầu giảm nhịp thao tác hoặc tốc độ di chuyển.",
      "Phản hồi: Giảm tốc độ và duy trì quan sát đồng đội.",
      "Lưu ý: Khác với tín hiệu đi xuống bằng ngón cái."
    ],
    "categories": ["Điều khiển di chuyển"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-06",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/T07.jpeg"
  },
  {
    "id": 8,
    "title": "T08. Đi lên",
    "excerpt": "Thông báo hoặc yêu cầu đi lên theo phương án lặn.",
    "content": [
      "Thực hiện: Nắm bàn tay, ngón cái hướng lên; có thể chuyển động bàn tay theo hướng lên.",
      "Ý nghĩa: Thông báo hoặc yêu cầu đi lên theo phương án lặn.",
      "Phản hồi: Xác nhận và phối hợp di chuyển theo quy trình đã huấn luyện.",
      "Lưu ý: Không có nghĩa là nổi tự do hoặc bỏ qua kiểm soát quá trình nổi."
    ],
    "categories": ["Điều khiển di chuyển"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-07",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/T08.jpeg"
  },
  {
    "id": 9,
    "title": "T09. Đi xuống",
    "excerpt": "Thông báo hoặc yêu cầu đi xuống.",
    "content": [
      "Thực hiện: Nắm bàn tay, ngón cái hướng xuống; thể hiện rõ chiều chuyển động.",
      "Ý nghĩa: Thông báo hoặc yêu cầu đi xuống.",
      "Phản hồi: Xác nhận khả năng tiếp tục trước khi di chuyển.",
      "Lưu ý: Nếu có khó chịu hoặc vấn đề trang bị, báo sự cố thay vì xác nhận máy móc."
    ],
    "categories": ["Điều khiển di chuyển"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-07",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/T09.jpeg"
  },
  {
    "id": 10,
    "title": "T10. Giữ độ sâu",
    "excerpt": "Duy trì mức độ sâu hiện tại.",
    "content": [
      "Thực hiện: Đặt bàn tay nằm ngang, lòng bàn tay úp; chuyển nhẹ theo phương ngang.",
      "Ý nghĩa: Duy trì mức độ sâu hiện tại.",
      "Phản hồi: Ổn định độ sâu và xác nhận.",
      "Lưu ý: Không nghiêng cổ tay như ký hiệu có sự cố."
    ],
    "categories": ["Điều khiển di chuyển"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-08",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/T10.jpeg"
  },
  {
    "id": 11,
    "title": "T11. Di chuyển theo hướng chỉ",
    "excerpt": "Chỉ hướng di chuyển tiếp theo.",
    "content": [
      "Thực hiện: Nắm bàn tay, duỗi ngón trỏ theo hướng cần di chuyển trong mặt phẳng ngang.",
      "Ý nghĩa: Chỉ hướng di chuyển tiếp theo.",
      "Phản hồi: Quan sát hướng thật trong không gian rồi xác nhận.",
      "Lưu ý: Nếu chỉ lên hoặc xuống, dùng đúng ký hiệu T3 hoặc T4."
    ],
    "categories": ["Điều khiển di chuyển"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-08",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/T11.jpeg"
  },
  {
    "id": 12,
    "title": "T12. Quay lại",
    "excerpt": "Yêu cầu đổi hướng quay về theo kế hoạch.",
    "content": [
      "Thực hiện: Đưa ngón trỏ hướng lên và xoay bàn tay thành vòng tròn nhỏ.",
      "Ý nghĩa: Yêu cầu đổi hướng quay về theo kế hoạch.",
      "Phản hồi: Xác nhận, kiểm tra đồng đội và phối hợp quay lại.",
      "Lưu ý: Vòng tròn do ngón trỏ khác vòng tròn OK tạo bằng ngón cái và ngón trỏ."
    ],
    "categories": ["Điều khiển di chuyển"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-08",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/T12.jpeg"
  },
  {
    "id": 13,
    "title": "T13. Lại gần tôi",
    "excerpt": "Yêu cầu rút ngắn khoảng cách giữa hai người.",
    "content": [
      "Thực hiện: Đưa bàn tay về phía trước rồi vẫy các ngón hoặc bàn tay về phía thân mình.",
      "Ý nghĩa: Yêu cầu rút ngắn khoảng cách giữa hai người.",
      "Phản hồi: Tiếp cận có kiểm soát, giữ khoảng cách thao tác phù hợp.",
      "Lưu ý: Không phải lệnh kéo người phát hoặc kéo dây."
    ],
    "categories": ["Phối hợp với đồng đội"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-10",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/T13.jpeg"
  },
  {
    "id": 14,
    "title": "T14. Ghép đôi / Đi theo cặp",
    "excerpt": "Yêu cầu trở lại đội hình theo cặp.",
    "content": [
      "Thực hiện: Duỗi ngón trỏ của hai bàn tay và đưa hai ngón lại gần nhau.",
      "Ý nghĩa: Yêu cầu trở lại đội hình theo cặp.",
      "Phản hồi: Xác định đúng đồng đội và duy trì liên hệ.",
      "Lưu ý: Không diễn giải là số lượng nạn nhân hoặc số người cần hỗ trợ."
    ],
    "categories": ["Phối hợp với đồng đội"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-14",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/T14.jpeg"
  },
  {
    "id": 15,
    "title": "T15. Giãn cách một chút",
    "excerpt": "Yêu cầu tăng nhẹ khoảng cách giữa hai thợ lặn.",
    "content": [
      "Thực hiện: Duỗi ngón trỏ của hai bàn tay, hướng xuống dưới và tách hai ngón ra một khoảng nhỏ.",
      "Ý nghĩa: Yêu cầu tăng nhẹ khoảng cách giữa hai thợ lặn.",
      "Phản hồi: Điều chỉnh khoảng cách, tiếp tục duy trì liên hệ với đồng đội.",
      "Lưu ý: Không diễn giải là tách nhóm hoặc di chuyển độc lập."
    ],
    "categories": ["Phối hợp với đồng đội"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-15",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/T15.jpeg"
  },
  {
    "id": 16,
    "title": "T16. Nắm tay nhau",
    "excerpt": "Yêu cầu thiết lập tiếp xúc bàn tay giữa hai người.",
    "content": [
      "Thực hiện: Đan hoặc nắm hai bàn tay trước ngực để minh họa yêu cầu giữ liên hệ.",
      "Ý nghĩa: Yêu cầu thiết lập tiếp xúc bàn tay giữa hai người.",
      "Phản hồi: Chủ động đưa tay để thiết lập tiếp xúc đã thống nhất.",
      "Lưu ý: Đây là ký hiệu thị giác; chưa phải tín hiệu bóp tay X02."
    ],
    "categories": ["Phối hợp với đồng đội"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-16",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/T16.jpeg"
  },
  {
    "id": 17,
    "title": "T17. Kiểm tra thời gian",
    "excerpt": "Đề nghị đồng đội chú ý hoặc kiểm tra thời gian lặn.",
    "content": [
      "Thực hiện: Dùng ngón trỏ của một bàn tay chỉ vào đồng hồ hoặc máy tính lặn ở cổ tay còn lại.",
      "Ý nghĩa: Đề nghị đồng đội chú ý hoặc kiểm tra thời gian lặn.",
      "Phản hồi: Kiểm tra thiết bị và thông báo thời gian theo quy ước đã thống nhất.",
      "Lưu ý: Không tự diễn giải là hết thời gian hoặc phải kết thúc lượt lặn; cần kết hợp tín hiệu tiếp theo."
    ],
    "categories": ["Theo dõi thời gian và điều hành nhiệm vụ"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-17",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/T17.jpeg"
  },
  {
    "id": 18,
    "title": "T18. Tạm dừng / Chờ — chữ T",
    "excerpt": "Trong bộ ký hiệu đề xuất này, yêu cầu tạm dừng thao tác hoặc di chuyển để chờ trao đổi, chỉ dẫn tiếp theo.",
    "content": [
      "Thực hiện: Đặt một bàn tay nằm ngang, lòng bàn tay hướng xuống; bàn tay còn lại dựng đứng, các ngón duỗi khép, đầu ngón chạm phía dưới bàn tay nằm ngang để tạo hình chữ T.",
      "Ý nghĩa: Trong bộ ký hiệu đề xuất này, yêu cầu tạm dừng thao tác hoặc di chuyển để chờ trao đổi, chỉ dẫn tiếp theo.",
      "Phản hồi: Xác nhận, tạm dừng hoạt động đang thực hiện và duy trì liên hệ với người phát tín hiệu.",
      "Lưu ý: Hình mẫu ghi nhận chữ T đôi khi còn được dùng để báo 100 bar. Vì vậy, phải thống nhất một nghĩa trước khi lặn; không dùng đồng thời ký hiệu này cho cả “tạm dừng” và “100 bar” trong cùng bộ quy ước."
    ],
    "categories": ["Theo dõi thời gian và điều hành nhiệm vụ"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-19",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/T18.jpeg"
  },
  {
    "id": 19,
    "title": "  Dừng 3 phút",
    "excerpt": "Yêu cầu thực hiện khoảng dừng kéo dài 3 phút.",
    "content": [
      "Thực hiện: Đặt một bàn tay nằm ngang, lòng bàn tay hướng xuống; bàn tay còn lại duỗi ba ngón trỏ, giữa và áp út hướng lên, chạm vào phía dưới bàn tay nằm ngang.",
      "Ý nghĩa: Yêu cầu thực hiện khoảng dừng kéo dài 3 phút.",
      "Phản hồi: Xác nhận tín hiệu, duy trì vị trí và độ sâu đã thống nhất, theo dõi thời gian trên thiết bị.",
      "Lưu ý: Ba ngón biểu thị thời gian 3 phút, không phải độ sâu 3 m. Tín hiệu này không tự xác định độ sâu dừng hoặc thay thế yêu cầu dừng giảm áp."
    ],
    "categories": ["Theo dõi thời gian và điều hành nhiệm vụ"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-19",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/T19.jpeg"
  },
  {
    "id": 20,
    "title": "T20. Kết thúc nhiệm vụ",
    "excerpt": "Yêu cầu kết thúc nhiệm vụ dưới nước và triển khai thu hồi tổ lặn theo phương án.",
    "content": [
      "Thực hiện: Đưa hai cẳng tay bắt chéo hình chữ X trước ngực, sau đó ra tín hiệu ngón cái hướng lên để biểu thị kết thúc lượt lặn.",
      "Ý nghĩa: Yêu cầu kết thúc nhiệm vụ dưới nước và triển khai thu hồi tổ lặn theo phương án.",
      "Phản hồi: Xác nhận, phối hợp với đồng đội và thực hiện quy trình kết thúc lượt lặn đã thống nhất.",
      "Lưu ý: Dấu X với hai bàn tay nắm lại được RSTC dùng để báo “nguy hiểm”. Vì vậy, cách dùng cho “kết thúc nhiệm vụ” phải được thống nhất trước khi lặn, không dùng dấu X đơn độc để tránh nhầm lẫn."
    ],
    "categories": ["Theo dõi thời gian và điều hành nhiệm vụ"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-19",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/T20.jpeg"
  },
  {
    "id": 21,
    "title": "T21. Thuyền / Vị trí thuyền",
    "excerpt": "Chỉ phương tiện trên mặt nước trong trao đổi tiếp theo.",
    "content": [
      "Thực hiện: Khép hai bàn tay thành hình lòng thuyền trước ngực.",
      "Ý nghĩa: Chỉ phương tiện trên mặt nước trong trao đổi tiếp theo.",
      "Phản hồi: Xác nhận, kết hợp với chỉ hướng hoặc quay lại nếu cần.",
      "Lưu ý: Chỉ tên đối tượng; không tự mang nghĩa nổi lên hoặc kết thúc nhiệm vụ."
    ],
    "categories": ["Theo dõi thời gian và điều hành nhiệm vụ"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-20",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/T21.jpeg"
  },
  {
    "id": 22,
    "title": "T22. Còn bao nhiêu khí?",
    "excerpt": "Yêu cầu kiểm tra và báo lượng khí còn lại.",
    "content": [
      "Thực hiện: Dùng động tác hỏi lượng khí trong hình; khi cần chỉ trực tiếp đồng hồ áp suất để làm rõ câu hỏi.",
      "Ý nghĩa: Yêu cầu kiểm tra và báo lượng khí còn lại.",
      "Phản hồi: Đọc đồng hồ và báo trị số bằng cách đã thống nhất.",
      "Lưu ý: Hình kế thừa tài liệu [1]; không tự coi mọi nhóm thợ lặn đều hiểu cùng quy ước số."
    ],
    "categories": ["Kiểm tra và thông báo áp suất khí"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-21",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/T22.jpeg"
  },
  {
    "id": 23,
    "title": "T23. Áp suất khí còn 50 bar",
    "excerpt": "Thông báo áp suất khí còn 50 bar theo quy ước của mẫu.",
    "content": [
      "Thực hiện: Nắm một bàn tay, ngón cái gập bên ngoài các ngón còn lại; đưa nắm tay lên để đồng đội nhìn rõ.",
      "Ý nghĩa: Thông báo áp suất khí còn 50 bar theo quy ước của mẫu.",
      "Phản hồi: Xác nhận đã nhận đúng giá trị và đối chiếu với kế hoạch quản lý khí của tổ lặn.",
      "Lưu ý: Không nhầm với động tác đưa nắm tay vào ngực để báo “sắp hết khí”, hoặc duỗi cánh tay về phía nguy hiểm"
    ],
    "categories": ["Kiểm tra và thông báo áp suất khí"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-21",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/T23.jpeg"
  },
  {
    "id": 24,
    "title": "T24. Áp suất khí còn 100 bar — lặp tín hiệu 50 bar",
    "excerpt": "Thông báo áp suất khí còn 100 bar: 50 + 50.",
    "content": [
      "Thực hiện: Phát tín hiệu nắm tay biểu thị 50 bar hai lần liên tiếp, có khoảng ngắt rõ giữa hai lần.",
      "Ý nghĩa: Thông báo áp suất khí còn 100 bar: 50 + 50.",
      "Phản hồi: T1, Xác nhận đã hiểu giá trị 100 bar.",
      "Lưu ý: Hai lần phát là thành phần của giá trị số theo quy ước này, không phải chỉ lặp lại thông báo 50 bar. Dấu “×2” trên ảnh biểu thị số lần thực hiện."
    ],
    "categories": ["Kiểm tra và thông báo áp suất khí"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-22",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/T24.jpeg"
  },
  {
    "id": 25,
    "title": "T25. Áp suất khí còn 70 bar",
    "excerpt": "Thông báo áp suất khí còn 70 bar: 50 + 20.",
    "content": [
      "Thực hiện: Một tay nắm lại biểu thị 50 bar; tay còn lại duỗi ngón trỏ và ngón giữa biểu thị 20 bar.",
      "Ý nghĩa: Thông báo áp suất khí còn 70 bar: 50 + 20.",
      "Phản hồi: Xác nhận đã hiểu giá trị 70 bar.",
      "Lưu ý: Hai ngón duỗi biểu thị 20 bar trong chuỗi báo áp suất, không phải hai người hoặc hai phút."
    ],
    "categories": ["Kiểm tra và thông báo áp suất khí"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-23",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/T25.jpeg"
  },
  {
    "id": 26,
    "title": "T26. Áp suất khí còn 130 bar",
    "excerpt": "Thông báo áp suất khí còn 130 bar: 50 + 50 + 30.",
    "content": [
      "Thực hiện: Phát tín hiệu nắm tay biểu thị 50 bar hai lần; kết hợp tay còn lại duỗi ba ngón trỏ, giữa và áp út để biểu thị 30 bar.",
      "Ý nghĩa: Thông báo áp suất khí còn 130 bar: 50 + 50 + 30.",
      "Phản hồi: Xác nhận đã hiểu giá trị 130 bar.",
      "Lưu ý: Phải thể hiện rõ hai lần phát tín hiệu 50 bar; nếu chỉ thực hiện một lần rồi thêm ba ngón, giá trị theo quy ước này là 80 bar."
    ],
    "categories": ["Kiểm tra và thông báo áp suất khí"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-23",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/T26.jpeg"
  },
  {
    "id": 27,
    "title": "T27. Cân bằng áp suất tai",
    "excerpt": "Nhắc hoặc yêu cầu đồng đội cân bằng áp suất tai theo quy ước đã thống nhất.",
    "content": [
      "Thực hiện: Đưa một tay lên, dùng ngón cái và ngón trỏ bóp nhẹ phần mũi mềm của mặt nạ, mô phỏng động tác cân bằng áp suất tai.",
      "Ý nghĩa: Nhắc hoặc yêu cầu đồng đội cân bằng áp suất tai theo quy ước đã thống nhất.",
      "Phản hồi: Xác nhận đã hiểu; nếu gặp khó khăn, phát tín hiệu “có vấn đề” và chỉ vào tai.",
      "Lưu ý: Không đồng nhất với tín hiệu “đau tai” hoặc “không cân bằng được áp suất”."
    ],
    "categories": ["Tình trạng cơ thể và cân bằng áp suất"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-24",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/T27.jpeg"
  },
  {
    "id": 28,
    "title": "T28. Có vấn đề ở tai / Không cân bằng được áp suất",
    "excerpt": "Báo khó chịu hoặc khó cân bằng áp suất tai.",
    "content": [
      "Thực hiện: Dùng ngón trỏ chỉ vào vùng tai.",
      "Ý nghĩa: Báo khó chịu hoặc khó cân bằng áp suất tai.",
      "Phản hồi: Dừng thay đổi độ sâu và phối hợp xử lý theo huấn luyện.",
      "Lưu ý: Đây là thông báo vấn đề, không phải hướng dẫn cố tiếp tục lặn xuống."
    ],
    "categories": ["Tình trạng cơ thể và cân bằng áp suất"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-24",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/T28.jpeg"
  },
  {
    "id": 29,
    "title": "T29. Tôi bị lạnh",
    "excerpt": "Thông báo cảm giác lạnh ảnh hưởng đến người lặn.",
    "content": [
      "Thực hiện: Khoanh hai tay trước ngực; bàn tay ôm phần cánh tay đối diện.",
      "Ý nghĩa: Thông báo cảm giác lạnh ảnh hưởng đến người lặn.",
      "Phản hồi: Tiếp nhận và đánh giá việc tiếp tục nhiệm vụ theo phương án bảo đảm.",
      "Lưu ý: Không biến dấu hiệu này thành thang chẩn đoán mức hạ thân nhiệt."
    ],
    "categories": ["Tình trạng cơ thể và cân bằng áp suất"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-25",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/T29.jpeg"
  },
  {
    "id": 30,
    "title": "T30. Nguy hiểm theo hướng chỉ",
    "excerpt": "Cảnh báo nguy hiểm theo hướng đã chỉ.",
    "content": [
      "Thực hiện: Nắm bàn tay và duỗi cánh tay về phía có nguy cơ.",
      "Ý nghĩa: Cảnh báo nguy hiểm theo hướng đã chỉ.",
      "Phản hồi: Dừng tiếp cận nguy cơ, quan sát và nhận chỉ dẫn tiếp theo.",
      "Lưu ý: Cần phân biệt với chỉ hướng di chuyển bằng ngón cái."
    ],
    "categories": ["Cảnh báo nguy hiểm và sự cố khí thở"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-26",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/T30.jpeg"
  },
  {
    "id": 31,
    "title": "T31. Hết khí",
    "excerpt": "Báo không còn nguồn khí thở sử dụng được.",
    "content": [
      "Thực hiện: Bàn tay duỗi, lòng bàn tay úp, đưa ngang phía trước cổ theo động tác cắt.",
      "Ý nghĩa: Báo không còn nguồn khí thở sử dụng được.",
      "Phản hồi: Thực hiện hỗ trợ khí theo kỹ năng đã huấn luyện; không trì hoãn chỉ để lặp ký hiệu.",
      "Phân biệt: Không nhầm với ít khí; không tháo bộ phận thở chỉ để làm động tác."
    ],
    "categories": ["Cảnh báo nguy hiểm và sự cố khí thở"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-26",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/T31.jpeg"
  },
  {
    "id": 32,
    "title": "T32. Yêu cầu chia sẻ khí",
    "excerpt": "Yêu cầu hỗ trợ nguồn khí thở.",
    "content": [
      "Thực hiện: Đưa các ngón tay chỉ về vùng bộ điều áp hoặc miệng trong tầm nhìn đồng đội.",
      "Ý nghĩa: Yêu cầu hỗ trợ nguồn khí thở.",
      "Phản hồi: Tiếp nhận và hỗ trợ theo cấu hình trang bị, kỹ năng đã huấn luyện.",
      "Lưu ý: Hình chỉ biểu đạt thông điệp; không mô tả trình tự chuyển nguồn khí."
    ],
    "categories": ["Cảnh báo nguy hiểm và sự cố khí thở"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-27",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/T32.jpeg"
  },
  {
    "id": 33,
    "title": "T33. Tôi ổn trên mặt nước — một tay trên đầu",
    "excerpt": "Báo tình trạng ổn cho người ở xa trên mặt nước.",
    "content": [
      "Thực hiện: Đưa một cánh tay lên cao; đầu ngón tay chạm đỉnh đầu tạo cung lớn.",
      "Ý nghĩa: Báo tình trạng ổn cho người ở xa trên mặt nước.",
      "Phản hồi: Người bảo đảm quan sát và xác nhận theo phương thức đã thống nhất.",
      "Lưu ý: Chỉ dùng trong ngữ cảnh mặt nước; không phải ký hiệu gọi cứu."
    ],
    "categories": ["Liên lạc trên mặt nước"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-28",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/T33.jpeg"
  },
  {
    "id": 34,
    "title": "T34. Tôi ổn trên mặt nước — hai tay tạo vòng tròn",
    "excerpt": "Báo tình trạng ổn trên mặt nước khi hai tay rảnh.",
    "content": [
      "Thực hiện: Đưa hai cánh tay lên cao; đầu ngón tay chạm nhau tạo vòng lớn trên đầu.",
      "Ý nghĩa: Báo tình trạng ổn trên mặt nước khi hai tay rảnh.",
      "Phản hồi: Người bảo đảm nhận biết và tiếp tục theo dõi.",
      "Lưu ý: Không dùng nếu phải buông phương tiện đang cần giữ để bảo đảm an toàn."
    ],
    "categories": ["Liên lạc trên mặt nước"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-28",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/T34.jpeg"
  },
  {
    "id": 35,
    "title": "T35. Cần trợ giúp trên mặt nước",
    "excerpt": "Kêu gọi trợ giúp trên mặt nước.",
    "content": [
      "Thực hiện: Vẫy cánh tay rõ ràng từ ngang mặt nước lên phía trên đầu.",
      "Ý nghĩa: Kêu gọi trợ giúp trên mặt nước.",
      "Phản hồi: Triển khai hỗ trợ theo phương án cứu nạn.",
      "Lưu ý: Không nhầm với vòng tay trên đầu báo ổn; tín hiệu này không áp dụng như động tác dưới nước."
    ],
    "categories": ["Liên lạc trên mặt nước"],
    "tags": ["Ký hiệu tay"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-29",
    "readTime": 1,
    "icon": "🤚",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/T35.jpeg"
  },
  {
    "id": 36,
    "title": "D01. Một lần giật",
    "excerpt": "Gửi xuống: Hỏi tình trạng; yêu cầu lặp lại theo ngữ cảnh. Gửi lên: Báo ổn, đã đến đáy; đề nghị thu chùng hoặc lặp lại theo ngữ cảnh.",
    "content": [
      "Gửi xuống: Hỏi tình trạng; yêu cầu lặp lại theo ngữ cảnh.",
      "Gửi lên: Báo ổn, đã đến đáy; đề nghị thu chùng hoặc lặp lại theo ngữ cảnh.",
      "Lưu ý: D01 là tín hiệu đa nghĩa phụ thuộc giai đoạn lặn; bài tập phải nêu tình huống."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-29",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/D01.png"
  },
  {
    "id": 37,
    "title": "D02. Hai lần giật",
    "excerpt": "Gửi xuống: Kiểm tra dự trữ khí. Gửi lên: Báo đã kiểm tra dự trữ khí.",
    "content": [
      "Gửi xuống: Kiểm tra dự trữ khí.",
      "Gửi lên: Báo đã kiểm tra dự trữ khí.",
      "Lưu ý: Không dùng hai lần giật với nghĩa cấp thêm dây trong hệ mã này."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-30",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/D02.png"
  },
  {
    "id": 38,
    "title": "D03. Ba lần giật",
    "excerpt": "Gửi xuống: Đi lên; bắt đầu quá trình đưa lên. Gửi lên: Báo đang đi lên.",
    "content": [
      "Gửi xuống: Đi lên; bắt đầu quá trình đưa lên.",
      "Gửi lên: Báo đang đi lên.",
      "Lưu ý: Không có nghĩa là phát hiện nạn nhân; quản lý quá trình đi lên theo phương án lặn."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-09-30",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/D03.png"
  },
  {
    "id": 39,
    "title": "D04. Bốn lần giật",
    "excerpt": "Gửi xuống: Kiểm tra dự trữ khí hoặc chỉ báo áp suất tối thiểu. Gửi lên: Báo chỉ báo áp suất tối thiểu đã hoạt động.",
    "content": [
      "Gửi xuống: Kiểm tra dự trữ khí hoặc chỉ báo áp suất tối thiểu.",
      "Gửi lên: Báo chỉ báo áp suất tối thiểu đã hoạt động.",
      "Lưu ý: Chỉ áp dụng phần chỉ báo nếu trang bị có chức năng tương ứng."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-02",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/D04.png"
  },
  {
    "id": 40,
    "title": "D05. Giật nhanh liên tiếp trên bốn lần",
    "excerpt": "Gửi xuống: Không gán nghĩa phát từ mặt nước trong bảng lựa chọn. Gửi lên: Báo động; người lặn gặp nguy cấp, yêu cầu hỗ trợ đưa lên.",
    "content": [
      "Gửi xuống: Không gán nghĩa phát từ mặt nước trong bảng lựa chọn.",
      "Gửi lên: Báo động; người lặn gặp nguy cấp, yêu cầu hỗ trợ đưa lên.",
      "Lưu ý: Nhận biết là báo động và xử lý ngay; không chờ đếm đủ một số lần cố định lớn hơn năm."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-02",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/D05.png"
  },
  {
    "id": 41,
    "title": "D06. Một lần lắc",
    "excerpt": "Gửi xuống: Dừng di chuyển hoặc dừng quá trình xuống/lên. Gửi lên: Yêu cầu dừng quá trình xuống/lên.",
    "content": [
      "Gửi xuống: Dừng di chuyển hoặc dừng quá trình xuống/lên.",
      "Gửi lên: Yêu cầu dừng quá trình xuống/lên.",
      "Lưu ý: Phải phân biệt cảm giác lắc và giật khi mang trang bị thực tế."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-02",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/D06.png"
  },
  {
    "id": 42,
    "title": "D07.Hai lần lắc",
    "excerpt": "Gửi xuống: Tiếp tục xuống hoặc di chuyển; đi thẳng theo ngữ cảnh. Gửi lên: Yêu cầu tiếp tục xuống hoặc nới dây.",
    "content": [
      "Gửi xuống: Tiếp tục xuống hoặc di chuyển; đi thẳng theo ngữ cảnh.",
      "Gửi lên: Yêu cầu tiếp tục xuống hoặc nới dây.",
      "Lưu ý: Không tự bổ sung nghĩa tiếp tục nổi khi chưa được phương án xác định."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-03",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/D07.png"
  },
  {
    "id": 43,
    "title": "D08. Ba lần lắc",
    "excerpt": "Gửi xuống: Giữ vị trí; đang cho người lặn thứ hai xuống. Gửi lên: Báo mắc kẹt, không thể ra nếu không có người lặn khác hỗ trợ.",
    "content": [
      "Gửi xuống: Giữ vị trí; đang cho người lặn thứ hai xuống.",
      "Gửi lên: Báo mắc kẹt, không thể ra nếu không có người lặn khác hỗ trợ.",
      "Lưu ý: Không kéo mạnh để giải thoát bằng dây; xử lý theo phương án người lặn bị mắc."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-03",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/D08.png"
  },
  {
    "id": 44,
    "title": "D09. Một giật rồi một lắc",
    "excerpt": "Gửi xuống: Di chuyển sang phải. Gửi lên: Không gán thông điệp độc lập từ dưới lên.",
    "content": [
      "Gửi xuống: Di chuyển sang phải.",
      "Gửi lên: Không gán thông điệp độc lập từ dưới lên.",
      "Lưu ý: Phải xác định hệ quy chiếu phải/trái trước khi lặn; xác nhận theo quy trình tổ."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-03",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/D09.png"
  },
  {
    "id": 45,
    "title": "D10. Hai giật rồi một lắc",
    "excerpt": "Gửi xuống: Di chuyển sang trái. Gửi lên: Không gán thông điệp độc lập từ dưới lên.",
    "content": [
      "Gửi xuống: Di chuyển sang trái.",
      "Gửi lên: Không gán thông điệp độc lập từ dưới lên.",
      "Lưu ý: Sửa dòng “giật + lắc 2 lần” trong bản gửi; trình tự chính xác là hai giật rồi một lắc."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-03",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/D10.png"
  },
  {
    "id": 46,
    "title": "D11. Một giật rồi kéo",
    "excerpt": "Gửi xuống: Không gán thông điệp độc lập từ trên xuống. Gửi lên: Đề nghị chuyển dụng cụ.",
    "content": [
      "Gửi xuống: Không gán thông điệp độc lập từ trên xuống.",
      "Gửi lên: Đề nghị chuyển dụng cụ.",
      "Lưu ý: “Dụng cụ” tương ứng инструмент; không diễn giải chung thành phương tiện."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-05",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/D11.png"
  },
  {
    "id": 47,
    "title": "D12. Hai giật rồi kéo",
    "excerpt": "Gửi xuống: Không gán thông điệp độc lập từ trên xuống. Gửi lên: Đề nghị chuyển dây.",
    "content": [
      "Gửi xuống: Không gán thông điệp độc lập từ trên xuống.",
      "Gửi lên: Đề nghị chuyển dây.",
      "Lưu ý: Phân biệt kéo với lắc bằng thực hành; không suy ra thời lượng chuẩn từ độ dài nét hình."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-06",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/D12.png"
  },
  {
    "id": 48,
    "title": "D13. Giật rồi lắc rồi giật",
    "excerpt": "Gửi xuống: Tín hiệu dự phòng, chưa gán nội dung trong bản thảo. Gửi lên: Tín hiệu dự phòng, chưa gán nội dung trong bản thảo.",
    "content": [
      "Gửi xuống: Tín hiệu dự phòng, chưa gán nội dung trong bản thảo.",
      "Gửi lên: Tín hiệu dự phòng, chưa gán nội dung trong bản thảo.",
      "Lưu ý: Không tự dùng để báo nạn nhân, báo nguy hoặc thay một lệnh hiện có."
    ],
    "categories": ["Bộ ký hiệu dây"],
    "tags": ["Ký hiệu dây"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-06",
    "readTime": 1,
    "icon": "🪢",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/D13.png"
  },
  {
    "id": 49,
    "title": "A01. Thu hút chú ý",
    "excerpt": "Yêu cầu quan sát người phát.",
    "content": [
      "Thực hiện: Lia nhẹ vệt sáng vào vùng nền trong tầm quan sát của đồng đội, rồi phát ký hiệu tay đã chiếu sáng.",
      "Ý nghĩa: Yêu cầu quan sát người phát.",
      "Phản hồi: Quay sự chú ý về phía người phát.",
      "Giới hạn: Đề xuất thao tác gọi chú ý; không coi số lần lia là mã quốc tế."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-06",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/A01.png"
  },
  {
    "id": 50,
    "title": "A02. Tôi ổn / Ổn không",
    "excerpt": "Hỏi hoặc báo tình trạng ổn.",
    "content": [
      "Thực hiện: Vẽ một vòng tròn lớn, rõ bằng vệt sáng trên nền nhìn thấy được.",
      "Ý nghĩa: Hỏi hoặc báo tình trạng ổn.",
      "Phản hồi: Phản hồi bằng vòng sáng hoặc ký hiệu OK nhìn rõ.",
      "Giới hạn: Kế thừa hướng dẫn PADI [3]; không chiếu vòng sáng vào mắt."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-06",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/A02.png"
  },
  {
    "id": 51,
    "title": "A03. Có vấn đề cần hỗ trợ",
    "excerpt": "Báo có vấn đề, cần người nhận chú ý và hỗ trợ.",
    "content": [
      "Thực hiện: Lia vệt sáng nhanh, lặp qua lại theo phương ngang trong vùng người nhận quan sát được.",
      "Ý nghĩa: Báo có vấn đề, cần người nhận chú ý và hỗ trợ.",
      "Phản hồi: Chú ý ngay, tiếp cận phù hợp và xác định vấn đề.",
      "Giới hạn: Kế thừa PADI [3]; không tách thành hai mã nguy hiểm và khẩn cấp chỉ bằng cảm nhận nhanh/chậm."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-07",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/A03.png"
  },
  {
    "id": 52,
    "title": "A04. Đi lên bằng tay được chiếu sáng",
    "excerpt": "Thông điệp đi lên như T3.",
    "content": [
      "Thực hiện: Chiếu đèn vào bàn tay đang làm ký hiệu T3; ngón cái hướng lên.",
      "Ý nghĩa: Thông điệp đi lên như T3.",
      "Phản hồi: Xác nhận T3 và phối hợp đi lên theo phương án.",
      "Giới hạn: Thay thao tác hất đèn lên đơn độc trong bản gửi bằng ký hiệu tay nhìn rõ."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-07",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/anh-sang-chieu-tay.png"
  },
  {
    "id": 53,
    "title": "A05. Đi xuống bằng tay được chiếu sáng",
    "excerpt": "Thông điệp đi xuống như T4.",
    "content": [
      "Thực hiện: Chiếu đèn vào bàn tay đang làm ký hiệu T4; ngón cái hướng xuống.",
      "Ý nghĩa: Thông điệp đi xuống như T4.",
      "Phản hồi: Xác nhận khả năng tiếp tục trước khi đi xuống.",
      "Giới hạn: Không lấy hướng chiếu sáng xuống đáy làm lệnh đi xuống."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-08",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/anh-sang-chieu-tay.png"
  },
  {
    "id": 54,
    "title": "A06. Chỉ hướng di chuyển",
    "excerpt": "Chỉ hướng di chuyển trong không gian.",
    "content": [
      "Thực hiện: Chiếu sáng bàn tay T12 đang chỉ đúng hướng; để đồng đội nhìn rõ hình dạng và hướng ngón cái.",
      "Ý nghĩa: Chỉ hướng di chuyển trong không gian.",
      "Phản hồi: Xác nhận đúng hướng trước khi đổi hướng.",
      "Giới hạn: Bỏ quy ước chỉ hất đèn trái/phải, vì có thể nhầm với quan sát nền."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-08",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/anh-sang-chieu-tay.png"
  },
  {
    "id": 55,
    "title": "A07. Tiếp tục di chuyển",
    "excerpt": "Tiếp tục theo hướng được chỉ.",
    "content": [
      "Thực hiện: Sau khi thu hút chú ý, chiếu sáng ký hiệu chỉ hướng T12 trong ngữ cảnh đã thống nhất là tiếp tục.",
      "Ý nghĩa: Tiếp tục theo hướng được chỉ.",
      "Phản hồi: Xác nhận và di chuyển có kiểm soát.",
      "Giới hạn: Không duy trì mã nháy hai lần trong bản gửi khi chưa có căn cứ và kiểm chứng."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-09",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/anh-sang-chieu-tay.png"
  },
  {
    "id": 56,
    "title": "A08. Quay lại",
    "excerpt": "Quay lại theo kế hoạch.",
    "content": [
      "Thực hiện: Chiếu sáng bàn tay đang làm T13, ngón trỏ xoay thành vòng nhỏ.",
      "Ý nghĩa: Quay lại theo kế hoạch.",
      "Phản hồi: Xác nhận và giữ liên hệ đồng đội khi đổi hướng.",
      "Giới hạn: Không dùng nháy ba lần như quy ước mặc định; vòng ngón trỏ không phải vòng sáng A02."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-09",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/anh-sang-chieu-tay.png"
  },
  {
    "id": 57,
    "title": "A09. Chỉ vị trí trang bị cần kiểm tra",
    "excerpt": "Làm rõ đối tượng đang được trao đổi.",
    "content": [
      "Thực hiện: Giữ vệt sáng tại bộ phận cần chú ý, kết hợp chỉ tay hoặc T5 khi có sự cố.",
      "Ý nghĩa: Làm rõ đối tượng đang được trao đổi.",
      "Phản hồi: Quan sát đúng bộ phận và báo kết quả bằng ký hiệu phù hợp.",
      "Giới hạn: Đây là chỉ dẫn bằng chiếu sáng, không phải mã nhịp độc lập."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-10",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/A09.png"
  },
  {
    "id": 58,
    "title": "A10. Duy trì dấu nhận biết vị trí",
    "excerpt": "Hỗ trợ nhận biết vị trí.",
    "content": [
      "Thực hiện: Giữ nguồn sáng ổn định tại vị trí đã thống nhất để đồng đội nhận biết vị trí người lặn.",
      "Ý nghĩa: Hỗ trợ nhận biết vị trí.",
      "Phản hồi: Duy trì quan sát và liên hệ theo đội hình.",
      "Giới hạn: Đèn sáng không chứng minh người lặn còn tỉnh hoặc đã nhận lệnh; không thay tín hiệu OK."
    ],
    "categories": ["Bộ ký hiệu ánh sáng"],
    "tags": ["Ký hiệu ánh sáng"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-10",
    "readTime": 1,
    "icon": "🔦",
    "colors": ["#0873b9", "#4a7fb5"],
    "path": "images/A10.png"
  },
  {
    "id": 59,
    "title": "X01. Vỗ nhẹ vai để gọi chú ý",
    "excerpt": "Gọi chú ý và thiết lập liên lạc gần.",
    "content": [
      "Thực hiện: Đặt bàn tay lên vùng vai ngoài có thể tiếp cận; vỗ nhẹ để người kia nhận biết, sau đó chuyển sang tiếp xúc bàn tay hoặc cẳng tay.",
      "Ý nghĩa: Gọi chú ý và thiết lập liên lạc gần.",
      "Phản hồi: Dừng thao tác đang phân tán chú ý, xác định đồng đội và tiếp nhận tín hiệu tiếp theo.",
      "Căn cứ và giới hạn: ĐỀ XUẤT CẦN THỬ NGHIỆM. Không gán số nhịp vỗ vai cho đi lên, đi xuống hoặc báo nạn nhân. Tránh van, ống, mặt nạ và vị trí đau."
    ],
    "categories": ["Vỗ vai và bóp tay"],
    "tags": ["Ký hiệu tiếp xúc"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-11",
    "readTime": 1,
    "icon": "🤝",
    "colors": ["#065a91", "#1b9aaa"],
    "path": "images/X01.png"
  },
  {
    "id": 60,
    "title": "X02. Bóp để dừng",
    "excerpt": "Yêu cầu dừng.",
    "content": [
      "Thực hiện: Khi đã thiết lập tiếp xúc, bóp rõ vào bàn tay hoặc cẳng tay ở vị trí đã thống nhất; không xoắn hoặc giật.",
      "Ý nghĩa: Yêu cầu dừng.",
      "Phản hồi: Dừng chuyển động, duy trì tiếp xúc và chờ thông tin tiếp theo.",
      "Căn cứ và giới hạn: Ý nghĩa bóp = dừng tham khảo ERDI [5]. Vị trí tiếp xúc cụ thể là quy cách triển khai cần kiểm tra với găng và trang bị."
    ],
    "categories": ["Vỗ vai và bóp tay"],
    "tags": ["Ký hiệu tiếp xúc"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-12",
    "readTime": 1,
    "icon": "🤝",
    "colors": ["#0873b9", "#1592d4"],
    "path": "images/X02.png"
  },
  {
    "id": 61,
    "title": "X03. Bóp nhanh liên tiếp báo vấn đề hết khí",
    "excerpt": "Báo vấn đề hết khí, cần hỗ trợ ngay.",
    "content": [
      "Thực hiện: Đang giữ tiếp xúc, thực hiện các lần bóp nhanh, phân biệt rõ với một lần bóp dừng.",
      "Ý nghĩa: Báo vấn đề hết khí, cần hỗ trợ ngay.",
      "Phản hồi: Chuyển sang hỗ trợ khí theo kỹ năng đã huấn luyện, không chờ phản hồi hình thức.",
      "Căn cứ và giới hạn: Ý nghĩa tham khảo ERDI [5]; không dùng cùng kiểu bóp nhanh để báo OK hay báo phát hiện nạn nhân."
    ],
    "categories": ["Vỗ vai và bóp tay"],
    "tags": ["Ký hiệu tiếp xúc"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-12",
    "readTime": 1,
    "icon": "🤝",
    "colors": ["#065a91", "#2a8fbd"],
    "path": "images/X03.png"
  },
  {
    "id": 62,
    "title": "X04. Đẩy nhẹ theo hướng tiến",
    "excerpt": "Yêu cầu đi tiếp theo hướng tiến.",
    "content": [
      "Thực hiện: Giữ tiếp xúc cẳng tay; truyền lực đẩy nhẹ theo chiều tiến đã thống nhất của đội hình.",
      "Ý nghĩa: Yêu cầu đi tiếp theo hướng tiến.",
      "Phản hồi: Nhận đúng hướng rồi di chuyển có kiểm soát, giữ liên hệ.",
      "Căn cứ và giới hạn: Tham khảo ERDI [5], SSI [6]. Lực chỉ để truyền tin, không dùng để cưỡng bức đẩy người qua chướng ngại."
    ],
    "categories": ["Vỗ vai và bóp tay"],
    "tags": ["Ký hiệu tiếp xúc"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-14",
    "readTime": 1,
    "icon": "🤝",
    "colors": ["#0a6aa8", "#3d8fa5"],
    "path": "images/X04.png"
  },
  {
    "id": 63,
    "title": "X05. Kéo nhẹ theo hướng lùi",
    "excerpt": "Yêu cầu lùi lại.",
    "content": [
      "Thực hiện: Giữ tiếp xúc cẳng tay; truyền lực kéo nhẹ về chiều lùi của đội hình.",
      "Ý nghĩa: Yêu cầu lùi lại.",
      "Phản hồi: Dừng tiến, kiểm tra khả năng lùi và di chuyển có kiểm soát.",
      "Căn cứ và giới hạn: Tham khảo ERDI [5], SSI [6]. Không kéo vào ống thở, van, mặt nạ hoặc dùng động tác này để kéo giải thoát người bị mắc."
    ],
    "categories": ["Vỗ vai và bóp tay"],
    "tags": ["Ký hiệu tiếp xúc"],
    "author": "Tác giả: Đường Khắc Tùng",
    "date": "2026-10-14",
    "readTime": 1,
    "icon": "🤝",
    "colors": ["#1592d4", "#2f5d8a"],
    "path": "images/X05.png"
  }
];
