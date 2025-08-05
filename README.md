# Portofolio

# 🚀 Dynamic Portfolio Website

Modern, interactive portfolio website dengan animasi menarik dan desain responsive.

![Status](https://img.shields.io/badge/Status-Ready-brightgreen)
![Mobile](https://img.shields.io/badge/Mobile-Responsive-blue)

## ✨ Fitur Utama

- 🎨 **Animasi Interaktif** - Partikel background, typing animation, hover effects
- 📱 **Responsive Design** - Sempurna di semua device
- ⚡ **Performance Optimal** - Fast loading dan smooth animations
- 🎯 **AOS Animations** - Scroll-triggered animations yang smooth
- 💼 **Portfolio Showcase** - Section untuk menampilkan projects
- 📧 **Contact Form** - Form kontak yang berfungsi dengan validasi

## 🛠️ Teknologi

- **HTML5** - Struktur semantic
- **CSS3** - Styling modern dengan gradients dan animations
- **JavaScript ES6+** - Interactivity dan animations
- **AOS Library** - Animate on scroll effects

## 🚀 Cara Menggunakan

### 1. Download/Clone
```bash
git clone https://github.com/HasanShadzily/portfolio.git
cd portfolio
```

### 2. Buka di Browser
```bash
# Langsung buka file
open index.html

# Atau pakai local server
python -m http.server 8000
```

### 3. Customize Content
Edit di `index.html`:
- Ganti nama dan informasi personal
- Update bagian About
- Tambahkan projects Anda
- Sesuaikan contact info

## ⚙️ Kustomisasi

### Ubah Teks Typing Animation
```javascript
const texts = [
    'Web Developer',
    'Frontend Developer',
    'UI/UX Designer'
];
```

### Sesuaikan Warna
```css
:root {
    --primary-color: #00ff88;  /* Hijau */
    --secondary-color: #0088ff; /* Biru */
    --bg-color: #000;          /* Hitam */
}
```

### Atur Jumlah Partikel
```javascript
config: {
    particles: {
        count: 50        // Default: 50
    }
}
```

## 📱 Responsive Breakpoints

- 📱 Mobile: 320px+
- 📟 Tablet: 768px+
- 💻 Desktop: 1024px+

## 🚀 Deploy

Portfolio ini bisa di-deploy ke:
- **GitHub Pages** (Gratis)
- **Netlify** (Gratis)
- **Vercel** (Gratis)

### Deploy ke GitHub Pages:
1. Push ke repository GitHub
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: main
5. Done! ✅

## 📂 Struktur File

```
portfolio/
├── index.html          # File utama
├── README.md          # Dokumentasi
├── style.css          
└── main.js
```

## 🔧 Troubleshooting

**Animasi AOS tidak jalan?**
- Pastikan koneksi internet untuk load AOS library

**Particles tidak muncul?**
- Check console browser untuk error
- Pastikan element `bgAnimation` ada

**Form tidak berfungsi?**
- Form hanya demo, perlu backend untuk functionality penuh

## 📝 License

MIT License - bebas digunakan dan dimodifikasi.

## 👨‍💻 Contact

**Nama Anda**
- 💼 LinkedIn: [Your LinkedIn](https://linkedin.com/in/hasanshadzily/)
- 📧 Email: dil.silimau@gmail.com

---

**⭐ Star repository ini jika bermanfaat!**
