<script>
// Yahan apne products add karo. Image link, price, detail sab yahan
const products = [
  {
    id: 1,
    name: "Apple iPhone 15 Pro Max 256GB",
    desc: "Titanium body, A17 Pro chip, 48MP main camera, 120Hz display, USB-C, All day battery",
    price: 425000,
    oldPrice: 465000,
    img: "https://images.unsplash.com/photo-1695651669553-059f947bca65?w=600",
    rating: 4.9,
    stock: 7
  },
  {
    id: 2,
    name: "Samsung 4K Smart LED TV 55 inch",
    desc: "Crystal 4K display, Smart Hub, Voice control, Dolby sound, Slim design, 3 HDMI ports",
    price: 189999,
    oldPrice: 229999,
    img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600",
    rating: 4.7,
    stock: 14
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    desc: "Best noise cancelling, 30 hours battery, Quick charge 3min = 3hr, Crystal clear mic",
    price: 74999,
    oldPrice: 89999,
    img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600",
    rating: 4.8,
    stock: 20
  },
  {
    id: 4,
    name: "Dell XPS 13 Laptop i7 16GB",
    desc: "13th Gen Intel i7, 16GB RAM, 512GB SSD, 13.4 inch 4K Touch, 12hr battery, Ultra slim",
    price: 349999,
    oldPrice: 389999,
    img: "https://images.unsplash.com/photo-1593642702821-c8da653da03f?w=600",
    rating: 4.8,
    stock: 9
  }
];

let orderList = JSON.parse(localStorage.getItem('orderList')) || [];

// Discount %
function discount(oldP, newP) {
  return Math.round(((oldP - newP) / oldP) * 100);
}

// Stars
function stars(r) {
  return '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r));
}

// Load products on page
function loadProds() {
  document.getElementById('prodGrid').innerHTML = products.map(p => `
    <div class="prod-card">
      <span class="sale-tag">-${discount(p.oldPrice, p.price)}% OFF</span>
      <div class="prod-img">
        <img src="${p.img}" alt="${p.name}">
        <button class="view-btn" onclick="openPopup(${p.id})">Quick View</button>
      </div>
      <div class="prod-info">
        <div class="prod-rating">${stars(p.rating)} ${p.rating}</div>
        <h3>${p.name}</h3>
        <p class="prod-desc">${p.desc}</p>
        <div class="price-line">
          <span class="new-price">Rs ${p.price.toLocaleString()}</span>
          <span class="old-price">Rs ${p.oldPrice.toLocaleString()}</span>
        </div>
        <div class="stock-line">✓ Only ${p.stock} pieces left</div>
        <div class="prod-actions">
          <button class="btn btn-order" onclick="addOrder(${p.id})">Add to Order List</button>
          <button class="btn btn-small" onclick="shareProd(${p.id})">📤</button>
          <button class="btn btn-small" onclick="downloadProd(${p.id})">⬇️</button>
        </div>
      </div>
    </div>
  `).join('');
  updateCount();
}

// Add to order list
function addOrder(id) {
  const prod = products.find(x => x.id === id);
  let item = orderList.find(x => x.id === id);

  if(item) {
    if(item.qty < prod.stock) item.qty++;
    else return alert('Stock khatam!');
  } else {
    orderList.push({...prod, qty: 1});
  }

  localStorage.setItem('orderList', JSON.stringify(orderList));
  updateCount();
  alert(prod.name + ' order list me add ho gaya ✓');
}

// Quick view popup
function openPopup(id) {
  const p = products.find(x => x.id === id);
  document.getElementById('popupData').innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:30px;">
      <img src="${p.img}" style="width:100%; border-radius:15px;">
      <div>
        <div style="color:#fbbf24; font-size:18px; margin-bottom:10px">${stars(p.rating)} ${p.rating}</div>
        <h2 style="margin:15px 0; font-size:28px">${p.name}</h2>
        <p style="color:#555; line-height:1.7; margin-bottom:20px; font-size:15px">${p.desc}</p>
        <div class="price-line">
          <span class="new-price" style="font-size:32px">Rs ${p.price.toLocaleString()}</span>
          <span class="old-price">Rs ${p.oldPrice.toLocaleString()}</span>
          <span class="sale-tag" style="position:static">-${discount(p.oldPrice, p.price)}% OFF</span>
        </div>
        <div class="stock-line" style="margin:15px 0; font-size:15px">✓ In Stock: ${p.stock} pieces</div>
        <button class="btn btn-order" style="width:100%; padding:15px; font-size:16px" onclick="addOrder(${p.id}); closePopup();">Add to Order List</button>
      </div>
    </div>
  `;
  document.getElementById('prodPopup').style.display = 'block';
}

function closePopup() {
  document.getElementById('prodPopup').style.display = 'none';
}

// Share product
function shareProd(id) {
  const p = products.find(x => x.id === id);
  const text = `${p.name}\nRs ${p.price.toLocaleString()} -${discount(p.oldPrice, p.price)}% OFF\n${p.desc}`;

  if(navigator.share) {
    navigator.share({title: p.name, text: text});
  } else {
    navigator.clipboard.writeText(text);
    alert('Details copy ho gayi!');
  }
}

// Download txt file
function downloadProd(id) {
  const p = products.find(x => x.id === id);
  const data = `Product: ${p.name}\nPrice: Rs ${p.price.toLocaleString()}\nOld Price: Rs ${p.oldPrice.toLocaleString()}\nDiscount: ${discount(p.oldPrice, p.price)}%\nRating: ${p.rating}/5\nStock: ${p.stock}\nDescription: ${p.desc}`;

  const blob = new Blob([data], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = p.name.replace(/\s+/g, '_') + '.txt';
  a.click();
}

function updateCount() {
  const total = orderList.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('orderCount').innerText = total;
}

function goOrder() {
  window.location.href = 'order.html'; // Apna order list page ka naam
}

window.onclick = e => {
  if(e.target == document.getElementById('prodPopup')) closePopup();
}

loadProds();
</script>

