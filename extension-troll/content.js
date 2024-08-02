if (CONFIG.all.static) {
  $(document).ready(function() {
    $("body").html(CONFIG.all.value);
  });
}

if (CONFIG.image.static) {
  $(document).ready(function() {
    $("img").attr("src", CONFIG.imgPath);
    $(window).on('scroll', function() {
      // Xử lý sự kiện cuộn ở đây
      $("img").attr("src", CONFIG.image.imgPath);
    });
  });
}

if (CONFIG.title.static) {
  $(document).ready(function() {
    // Đặt nội dung mới cho tất cả các tiêu đề h1, h2, ..., h6
    $("h1, h2, h3, h4, h5, h6").html(CONFIG.title.title);
    $(window).on('scroll', function() {
      // Xử lý sự kiện cuộn ở đây
      $("h1, h2, h3, h4, h5, h6").html(CONFIG.title.title);
    });
  });
}


