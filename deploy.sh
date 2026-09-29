#!/usr/bin/env bash
# ==============================================================================
# 🚀 PINTARLABS SOFTWARE STORE - UNIFIED 1-CLICK DEPLOY SCRIPT (UBUNTU)
# Frontend:  https://labspintar.com (React SPA build in client/dist)
# Backend:   https://market.labspintar.com (Express REST API on Port 5000 via PM2)
# ==============================================================================

set -e

# Otomatis mendeteksi root path proyek
ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
CLIENT_DIR="$ROOT_DIR/client"
SERVER_DIR="$ROOT_DIR/server"

FRONTEND_DOMAIN="labspintar.com"
BACKEND_DOMAIN="market.labspintar.com"

echo "=========================================================="
echo " 🚀 Memulai Full Deploy PintarLabs Marketplace"
echo " 📁 Lokasi Root: $ROOT_DIR"
echo " 🌐 Frontend:    https://$FRONTEND_DOMAIN"
echo " 🔌 Backend API: https://$BACKEND_DOMAIN"
echo "=========================================================="

# ------------------------------------------------------------------------------
# 1. Periksa & Install Node.js 20 LTS & PM2
# ------------------------------------------------------------------------------
if ! command -v node &> /dev/null; then
    echo "📦 [1/5] Node.js belum ditemukan. Menginstall Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs build-essential
else
    echo "✅ [1/5] Node.js terdeteksi: $(node -v) (npm: $(npm -v))"
fi

if ! command -v pm2 &> /dev/null; then
    echo "📦 Menginstall PM2 Process Manager..."
    sudo npm install -g pm2
else
    echo "✅ PM2 terdeteksi: $(pm2 -v)"
fi

# ------------------------------------------------------------------------------
# 2. Deploy Backend REST API (server/)
# ------------------------------------------------------------------------------
echo "⚙️ [2/5] Menyiapkan Backend REST API..."
cd "$SERVER_DIR"
mkdir -p logs uploads data
npm install --production

if [ ! -f .env ]; then
    echo "📝 Membuat file server/.env dari template..."
    cp .env.example .env
fi

echo "⚡ Menjalankan / Reload Backend di PM2..."
pm2 start ecosystem.config.js || pm2 reload market-api
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME || true

# ------------------------------------------------------------------------------
# 3. Build Frontend Marketplace (client/)
# ------------------------------------------------------------------------------
echo "🎨 [3/5] Membangun (Build) Frontend Web..."
cd "$CLIENT_DIR"
npm install
npm run build

echo "✅ Frontend berhasil di-compile ke: $CLIENT_DIR/dist"

# ------------------------------------------------------------------------------
# 4. Konfigurasi Nginx untuk Frontend & Backend
# ------------------------------------------------------------------------------
echo "🌐 [4/5] Mengonfigurasi Nginx Virtual Hosts..."

# 4a. Setup Backend Nginx (market.labspintar.com)
sudo cp "$ROOT_DIR/nginx/market.labspintar.com.conf" "/etc/nginx/sites-available/$BACKEND_DOMAIN"
sudo ln -sf "/etc/nginx/sites-available/$BACKEND_DOMAIN" "/etc/nginx/sites-enabled/$BACKEND_DOMAIN"

# 4b. Setup Frontend Nginx (labspintar.com) dengan path root dinamis
FRONTEND_CONF_TEMP="/tmp/$FRONTEND_DOMAIN.conf"
sed "s|root /var/www/pintarlabs-software-store/client/dist;|root $CLIENT_DIR/dist;|g" "$ROOT_DIR/nginx/labspintar.com.conf" > "$FRONTEND_CONF_TEMP"
sudo cp "$FRONTEND_CONF_TEMP" "/etc/nginx/sites-available/$FRONTEND_DOMAIN"
sudo ln -sf "/etc/nginx/sites-available/$FRONTEND_DOMAIN" "/etc/nginx/sites-enabled/$FRONTEND_DOMAIN"
rm -f "$FRONTEND_CONF_TEMP"

# ------------------------------------------------------------------------------
# 5. Uji & Reload Nginx
# ------------------------------------------------------------------------------
echo "🔍 [5/5] Menguji & Reload konfigurasi Nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "=========================================================="
echo " 🎉 FULL DEPLOYMENT BERHASIL SELESAI!"
echo "=========================================================="
echo "Status PM2 Service Backend:"
pm2 status
echo "----------------------------------------------------------"
echo "🌐 Frontend URL: https://$FRONTEND_DOMAIN"
echo "🔌 Backend API:  https://$BACKEND_DOMAIN/api/health"
echo "----------------------------------------------------------"
echo ""
echo "🔒 Untuk mengaktifkan SSL HTTPS Gratis (Let's Encrypt), jalankan:"
echo "sudo certbot --nginx -d $FRONTEND_DOMAIN -d www.$FRONTEND_DOMAIN -d $BACKEND_DOMAIN"
echo ""
