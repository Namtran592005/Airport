document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE MẪU (Nên tách ra file riêng để dùng chung) ---
  const allProducts = [
    {
      id: 1,
      name: "Áo Thun Cotton Basic",
      price: 250000,
      category: "ao-thun",
      images: [
        "https://via.placeholder.com/600x600/000/fff?text=Ao+Thun+1",
        "https://via.placeholder.com/600x600/111/fff?text=Mat+Sau",
        "https://via.placeholder.com/600x600/222/fff?text=Chat+Lieu",
      ],
      desc: "Chất liệu 100% cotton thoáng mát, co giãn 4 chiều. Thiết kế basic dễ dàng phối đồ, phù hợp cho mọi hoạt động hàng ngày.",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 2,
      name: "Quần Jean Slim-fit",
      price: 550000,
      category: "quan-jean",
      images: [
        "https://via.placeholder.com/600x600/333/fff?text=Quan+Jean+1",
        "https://via.placeholder.com/600x600/444/fff?text=Ong+Quan",
      ],
      desc: "Form quần slim-fit tôn dáng, chất liệu jean denim cao cấp, bền màu. Một item không thể thiếu trong tủ đồ của bạn.",
      sizes: ["29", "30", "31", "32", "33"],
    },
    {
      id: 3,
      name: "Áo Sơ Mi Oxford",
      price: 450000,
      category: "ao-so-mi",
      images: ["https://via.placeholder.com/600x600/eee/000?text=Ao+So+Mi+1"],
      desc: "Vải Oxford dày dặn, đứng form, mang lại vẻ ngoài lịch lãm và chỉn chu. Thích hợp cho môi trường công sở hoặc các dịp quan trọng.",
      sizes: ["S", "M", "L"],
    },
    {
      id: 4,
      name: "Mũ Lưỡi Trai Logo",
      price: 180000,
      category: "phu-kien",
      images: [
        "https://via.placeholder.com/600x600/666/fff?text=Phu+Kien+1",
        "https://via.placeholder.com/600x600/777/fff?text=Khoa+Sau",
      ],
      desc: "Thiết kế trẻ trung, năng động với logo thêu nổi. Chất liệu kaki bền đẹp, có khóa điều chỉnh size tiện lợi.",
      sizes: ["One Size"],
    },
    {
      id: 5,
      name: "Áo Thun In Họa Tiết",
      price: 320000,
      category: "ao-thun",
      images: ["https://via.placeholder.com/600x600/111/fff?text=Ao+Thun+2"],
      desc: "Áo thun với họa tiết độc đáo, thể hiện cá tính riêng của bạn.",
      sizes: ["M", "L", "XL"],
    },
    {
      id: 6,
      name: "Quần Jean Rách Gối",
      price: 680000,
      category: "quan-jean",
      images: ["https://via.placeholder.com/600x600/444/fff?text=Quan+Jean+2"],
      desc: "Phong cách bụi bặm và đường phố với chi tiết rách gối cá tính.",
      sizes: ["30", "31", "32"],
    },
    {
      id: 7,
      name: "Áo Sơ Mi Kẻ Caro",
      price: 480000,
      category: "ao-so-mi",
      images: ["https://via.placeholder.com/600x600/ddd/000?text=Ao+So+Mi+2"],
      desc: "Họa tiết kẻ caro không bao giờ lỗi mốt, dễ dàng kết hợp.",
      sizes: ["S", "M", "L"],
    },
    {
      id: 8,
      name: "Thắt Lưng Da Thật",
      price: 350000,
      category: "phu-kien",
      images: ["https://via.placeholder.com/600x600/777/fff?text=Phu+Kien+2"],
      desc: "Làm từ da bò thật 100%, càng dùng càng bóng đẹp. Đầu khóa kim loại chắc chắn.",
      sizes: ["One Size"],
    },
  ];

  // --- STATE & HELPERS ---
  const formatCurrency = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);
  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  const saveCart = () =>
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  let currentImageIndex = 0;

  // --- RENDER FUNCTIONS ---
  function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));
    const product = allProducts.find((p) => p.id === productId);

    if (!product) {
      document.getElementById(
        "productDetail"
      ).innerHTML = `<div style="text-align: center; grid-column: 1 / -1; padding: 4rem;"><h2>Không tìm thấy sản phẩm</h2><p>Sản phẩm bạn đang tìm kiếm không tồn tại.</p><a href="product.html" class="cta-button" style="margin-top: 1.5rem;">Quay lại</a></div>`;
      return;
    }

    document.getElementById("productContent").style.display = "block";

    const sizeOptions = product.sizes
      .map((size) => `<option value="${size}">${size}</option>`)
      .join("");

    // --- NEW: Generate Gallery HTML ---
    const thumbnailHTML = product.images
      .map(
        (img, index) =>
          `<img src="${img}" alt="Thumbnail ${
            index + 1
          }" class="thumbnail-img ${
            index === 0 ? "active" : ""
          }" data-index="${index}">`
      )
      .join("");

    const galleryHTML = `
            <div class="product-image-gallery">
                <div class="gallery-main-image">
                    <img id="mainProductImage" src="${product.images[0]}" alt="${product.name}">
                </div>
                <button id="prevImageBtn" class="gallery-nav-btn"><i class="fas fa-chevron-left"></i></button>
                <button id="nextImageBtn" class="gallery-nav-btn"><i class="fas fa-chevron-right"></i></button>
                <div class="gallery-thumbnails">${thumbnailHTML}</div>
            </div>`;

    // --- Populate main detail section ---
    document.getElementById("productDetail").innerHTML = `
            ${galleryHTML}
            <div class="product-info">
                <h1>${product.name}</h1>
                <div class="price">${formatCurrency(product.price)}</div>
                <p class="short-description">${product.desc}</p>
                <div class="product-options">
                    <div class="option-group"><label for="sizeSelect">Size</label><select id="sizeSelect">${sizeOptions}</select></div>
                    <div class="option-group"><label for="quantity">Số lượng</label><div class="quantity-control"><button id="quantityMinus">-</button><input type="number" id="quantityInput" value="1" min="1"><button id="quantityPlus">+</button></div></div>
                </div>
                <div class="add-to-cart-action"><button id="addToCartBtn" class="cta-button">Thêm vào giỏ hàng</button></div>
            </div>
        `;

    document.getElementById("fullDescription").textContent = product.desc;
    renderRelatedProducts(product.category, product.id);
    attachEventListeners(product);
  }

  function renderRelatedProducts(category, currentId) {
    const relatedGrid = document.getElementById("relatedProductsGrid");
    relatedGrid.innerHTML = "";
    const related = allProducts
      .filter((p) => p.category === category && p.id !== currentId)
      .slice(0, 4);
    related.forEach((p) => {
      relatedGrid.innerHTML += `
                <a href="detail.html?id=${p.id}" class="product-card">
                    <div class="product-card-img" style="background-image: url('${
                      p.images[0]
                    }');"></div>
                    <div class="product-card-info"><h3>${
                      p.name
                    }</h3><p>${formatCurrency(p.price)}</p></div>
                </a>
            `;
    });
  }

  // --- NEW: Function to update gallery display ---
  function updateGallery(productImages) {
    const mainImage = document.getElementById("mainProductImage");
    const thumbnails = document.querySelectorAll(".thumbnail-img");

    mainImage.src = productImages[currentImageIndex];

    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle("active", index === currentImageIndex);
    });
  }

  function attachEventListeners(product) {
    // Quantity controls
    document.getElementById("quantityPlus").addEventListener("click", () => {
      document.getElementById("quantityInput").value++;
    });
    document.getElementById("quantityMinus").addEventListener("click", () => {
      if (document.getElementById("quantityInput").value > 1)
        document.getElementById("quantityInput").value--;
    });

    // Add to cart
    document.getElementById("addToCartBtn").addEventListener("click", () => {
      const quantity = parseInt(document.getElementById("quantityInput").value);
      const selectedSize = document.getElementById("sizeSelect").value;
      const cartItemId = `${product.id}-${selectedSize}`;
      const existingItem = cart.find((item) => item.cartItemId === cartItemId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.images[0],
          size: selectedSize,
          quantity: quantity,
          cartItemId: cartItemId,
        });
      }
      saveCart();
      alert(
        `Đã thêm ${quantity} sản phẩm "${product.name}" (Size: ${selectedSize}) vào giỏ hàng!`
      );
    });

    // --- NEW: Gallery event listeners ---
    if (product.images.length > 1) {
      document.getElementById("nextImageBtn").addEventListener("click", () => {
        currentImageIndex = (currentImageIndex + 1) % product.images.length;
        updateGallery(product.images);
      });
      document.getElementById("prevImageBtn").addEventListener("click", () => {
        currentImageIndex =
          (currentImageIndex - 1 + product.images.length) %
          product.images.length;
        updateGallery(product.images);
      });
      document.querySelectorAll(".thumbnail-img").forEach((thumb) => {
        thumb.addEventListener("click", (e) => {
          currentImageIndex = parseInt(e.target.dataset.index);
          updateGallery(product.images);
        });
      });
    } else {
      // Hide nav buttons if only one image
      document.getElementById("nextImageBtn").style.display = "none";
      document.getElementById("prevImageBtn").style.display = "none";
    }
  }

  function loadSharedComponents() {
    const headerHTML = `<div class="header-container container"><a href="index.html" class="logo">MONOSHOP</a><nav class="desktop-nav"><ul class="nav-menu"><li class="nav-item"><a href="index.html" class="nav-link">Trang chủ</a></li><li class="nav-item"><a href="product.html" class="nav-link">Sản phẩm</a></li><li class="nav-item"><a href="about.html" class="nav-link">Giới thiệu</a></li><li class="nav-item"><a href="contact.html" class="nav-link">Liên hệ</a></li></ul></nav></div>`;
    document.getElementById("mainHeader").innerHTML = headerHTML;
    const footerHTML = `<div class="footer-container container"> <div class="footer-col"> <h3>MONOSHOP</h3> <p>Thời trang tối giản, chất lượng bền vững.</p></div><div class="footer-col"> <h3>Cửa hàng</h3> <ul class="footer-links"> <li><a href="product.html">Sản phẩm</a></li> <li><a href="about.html">Giới thiệu</a></li> <li><a href="contact.html">Liên hệ</a></li> </ul> </div> <div class="footer-col"> <h3>Hỗ trợ</h3> <ul class="footer-links"> <li><a href="contact.html">Liên hệ</a></li> <li><a href="#">Chính sách</a></li></ul> </div> </div> <div class="copyright"> <p>© 2023 MONOSHOP.</p> </div>`;
    document.getElementById("mainFooter").innerHTML = footerHTML;
  }

  loadSharedComponents();
  renderProductDetail();
});
