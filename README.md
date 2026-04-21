# 🎨 Cat Stock Management System

Sistem manajemen stok cat modern dengan fitur lengkap untuk tracking inventory, penjualan, dan profit analysis.

## ✨ Features

### 📦 **Stock Management**
- ✅ CRUD operations (Create, Read, Update, Delete) produk
- ✅ Real-time stock tracking
- ✅ Low stock alerts
- ✅ Product categorization (Brand, Jenis, Warna, Kemasan)

### 💰 **Sales Tracking**
- ✅ Input transaksi penjualan
- ✅ Automatic stock deduction
- ✅ Sales history dengan filter
- ✅ Real-time profit calculation

### 📊 **Analytics & Reports**
- ✅ Daily profit summary
- ✅ Sales performance metrics
- ✅ Stock level monitoring
- ✅ Interactive dashboard

### 🔐 **Authentication**
- ✅ Email-based login system
- ✅ Protected routes
- ✅ User session management

### 📱 **Modern UI/UX**
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Modern card-based interface
- ✅ Smooth animations and transitions
- ✅ Intuitive navigation

## 🚀 Tech Stack

- **Frontend**: React 19.2.5 + Vite 8.0.9
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Routing**: React Router 7.14.1

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Supabase account

## ⚙️ Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/DaffaHM/cat-stock.git
   cd cat-stock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup database**
   - Import SQL schema dari file `database-setup.sql`
   - Configure Row Level Security (RLS) sesuai kebutuhan

5. **Run development server**
   ```bash
   npm run dev
   ```

## 🏗️ Build for Production

```bash
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
1. Build project: `npm run build`
2. Upload `dist` folder ke Netlify
3. Set environment variables di Netlify dashboard

### Environment Variables untuk Production
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Dashboard.jsx
│   ├── SalesForm.jsx
│   ├── StockTable.jsx
│   └── ...
├── pages/              # Page components
│   ├── DashboardPage.jsx
│   ├── StockManagementPage.jsx
│   ├── SalesPage.jsx
│   └── ...
├── lib/                # Utilities
│   └── supabase.js
├── utils/              # Helper functions
│   └── formatCurrency.js
└── App.jsx             # Main app component
```

## 🎯 Usage

### 1. **Login**
- Gunakan email yang sudah terdaftar di Supabase Auth

### 2. **Manage Stock**
- Tambah produk baru dengan informasi lengkap
- Edit/update informasi produk
- Hapus produk yang tidak diperlukan
- Monitor stock levels

### 3. **Record Sales**
- Input transaksi penjualan
- Pilih produk dari dropdown atau search
- System otomatis mengurangi stock
- Track profit per transaksi

### 4. **View Reports**
- Dashboard overview dengan metrics
- Daily profit summary
- Sales history dengan filter
- Stock alerts untuk produk menipis

## 🔧 Configuration

### Database Schema
Aplikasi menggunakan 2 tabel utama:
- `stocks` - Data produk dan inventory
- `sales` - Data transaksi penjualan

### Authentication
- Email-based authentication via Supabase Auth
- Protected routes untuk semua halaman utama
- Auto-redirect ke login jika belum authenticated

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**DaffaHM**
- GitHub: [@DaffaHM](https://github.com/DaffaHM)

## 🙏 Acknowledgments

- Supabase untuk backend infrastructure
- Tailwind CSS untuk styling system
- Lucide React untuk icon library
- React team untuk amazing framework