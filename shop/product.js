document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE MẪU ---
  // Trong thực tế, dữ liệu này sẽ được lấy từ server.
  // Đã cập nhật để sử dụng mảng "images" cho mỗi sản phẩm.
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
    },
    {
      id: 3,
      name: "Áo Sơ Mi Oxford",
      price: 450000,
      category: "ao-so-mi",
      images: ["https://via.placeholder.com/600x600/eee/000?text=Ao+So+Mi+1"],
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
    },
    {
      id: 5,
      name: "Áo Thun In Họa Tiết",
      price: 320000,
      category: "ao-thun",
      images: ["https://via.placeholder.com/600x600/111/fff?text=Ao+Thun+2"],
    },
    {
      id: 6,
      name: "Quần Jean Rách Gối",
      price: 680000,
      category: "quan-jean",
      images: ["https://via.placeholder.com/600x600/444/fff?text=Quan+Jean+2"],
    },
    {
      id: 7,
      name: "Áo Sơ Mi Kẻ Caro",
      price: 480000,
      category: "ao-so-mi",
      images: ["https://via.placeholder.com/600x600/ddd/000?text=Ao+So+Mi+2"],
    },
    {
      id: 8,
      name: "Thắt Lưng Da Thật",
      price: 350000,
      category: "phu-kien",
      images: ["https://via.placeholder.com/600x600/777/fff?text=Phu+Kien+2"],
    },
    {
      id: 9,
      name: "Áo Thun Polo",
      price: 400000,
      category: "ao-thun",
      images: ["https://via.placeholder.com/600x600/222/fff?text=Ao+Thun+3"],
    },
    {
      id: 10,
      name: "Quần Kaki Ống Đứng",
      price: 490000,
      category: "quan-jean",
      images: ["https://via.placeholder.com/600x600/555/fff?text=Quan+Kaki"],
    },
    {
      id: 11,
      name: "Áo Sơ Mi Lụa",
      price: 750000,
      category: "ao-so-mi",
      images: ["https://via.placeholder.com/600x600/ccc/000?text=Ao+So+Mi+3"],
    },
    {
      id: 12,
      name: "Kính Mát Chống UV",
      price: 850000,
      category: "phu-kien",
      images: ["https://via.placeholder.com/600x600/888/fff?text=Phu+Kien+3"],
    },
  ];

  const categories = {
    all: "Tất cả",
    "ao-thun": "Áo Thun",
    "ao-so-mi": "Áo Sơ Mi",
    "quan-jean": "Quần Jean",
    "phu-kien": "Phụ Kiện",
  };

  // --- DOM SELECTORS ---
  const searchInput = document.getElementById("searchInput");
  const categoryList = document.getElementById("categoryList");
  const priceRange = document.getElementById("priceRange");
  const priceRangeValue = document.getElementById("priceRangeValue");
  const sortOptions = document.getElementById("sortOptions");
  const productGrid = document.getElementById("productGrid");
  const productCount = document.getElementById("productCount");
  const paginationContainer = document.getElementById("pagination");
  const noResultsDiv = document.getElementById("no-results");

  // --- STATE MANAGEMENT ---
  let currentPage = 1;
  const productsPerPage = 6;
  let currentFilters = {
    searchTerm: "",
    category: "all",
    maxPrice: 1000000,
    sortBy: "default",
  };

  // --- HELPER FUNCTIONS ---
  const formatCurrency = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(n);

  // --- RENDER FUNCTIONS ---
  function renderCategories() {
    categoryList.innerHTML = "";
    for (const key in categories) {
      categoryList.innerHTML += `
                <label>
                    <input type="radio" name="category" value="${key}" ${
        currentFilters.category === key ? "checked" : ""
      }>
                    ${categories[key]}
                </label>`;
    }
  }

  function renderProducts() {
    // 1. Filtering
    let filteredProducts = allProducts.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(currentFilters.searchTerm.toLowerCase());
      const matchesCategory =
        currentFilters.category === "all" ||
        p.category === currentFilters.category;
      const matchesPrice = p.price <= currentFilters.maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // 2. Sorting
    switch (currentFilters.sortBy) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
    }

    // 3. Pagination
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToRender = filteredProducts.slice(startIndex, endIndex);

    // 4. DOM Update
    productGrid.innerHTML = "";
    if (productsToRender.length === 0) {
      noResultsDiv.style.display = "block";
    } else {
      noResultsDiv.style.display = "none";
      productsToRender.forEach((p) => {
        const productCard = `
                    <a href="detail.html?id=${p.id}" class="product-card">
                        <div class="product-img" style="background-image: url('${
                          p.images[0]
                        }');"></div>
                        <div class="product-info">
                            <h3 class="product-title">${p.name}</h3>
                            <p class="product-price">${formatCurrency(
                              p.price
                            )}</p>
                        </div>
                    </a>`;
        productGrid.innerHTML += productCard;
      });
    }

    productCount.textContent = `Hiển thị ${productsToRender.length} trên ${totalProducts} sản phẩm`;
    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    paginationContainer.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      if (i === currentPage) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        currentPage = i;
        renderProducts();
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
      });
      paginationContainer.appendChild(button);
    }
  }

  // --- INITIALIZATION & EVENT LISTENERS ---
  function init() {
    // Read URL parameters on page load
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get("category");
    if (categoryFromUrl && categories[categoryFromUrl]) {
      currentFilters.category = categoryFromUrl;
    }

    renderCategories();
    renderProducts();

    // Search Event
    searchInput.addEventListener("input", (e) => {
      currentFilters.searchTerm = e.target.value;
      currentPage = 1;
      renderProducts();
    });

    // Category Filter Event
    categoryList.addEventListener("change", (e) => {
      if (e.target.name === "category") {
        currentFilters.category = e.target.value;
        currentPage = 1;
        renderProducts();
      }
    });

    // Price Filter Event
    priceRange.addEventListener("input", (e) => {
      currentFilters.maxPrice = parseInt(e.target.value);
      priceRangeValue.textContent = `Dưới ${formatCurrency(
        currentFilters.maxPrice
      )}`;
    });
    // We can debounce this event to avoid re-rendering on every single slider move
    // For simplicity, we'll re-render on 'change' (when mouse is released)
    priceRange.addEventListener("change", () => {
      currentPage = 1;
      renderProducts();
    });

    // Sort Event
    sortOptions.addEventListener("change", (e) => {
      currentFilters.sortBy = e.target.value;
      currentPage = 1;
      renderProducts();
    });
  }

  init();
});
