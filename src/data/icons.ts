export interface IconOption {
  icon: string;
  label: string;
}

export interface IconSection {
  title: string;
  icons: IconOption[];
}

export const iconSections: IconSection[] = [
  {
    title: "Makanan & Minuman",
    icons: [
      { icon: "restaurant", label: "Restoran" },
      { icon: "bakery_dining", label: "Roti" },
      { icon: "local_bar", label: "Bar" },
      { icon: "icecream", label: "Es Krim" },
      { icon: "egg_alt", label: "Telur" },
      { icon: "local_pizza", label: "Pizza" },
      { icon: "fastfood", label: "Fast Food" },
      { icon: "coffee", label: "Kopi" },
      { icon: "ramen_dining", label: "Ramen" },
      { icon: "lunch_dining", label: "Makan Siang" },
      { icon: "dinner_dining", label: "Makan Malam" },
      { icon: "breakfast_dining", label: "Sarapan" },
      { icon: "cake", label: "Kue" },
      { icon: "cookie", label: "Kukis" },
      { icon: "takeout_dining", label: "Bungkus" },
      { icon: "set_meal", label: "Paket" },
      { icon: "tapas", label: "Tapas" },
      { icon: "soup_kitchen", label: "Sup" },
      { icon: "water_drop", label: "Air" },
      { icon: "liquor", label: "Minuman" },
      { icon: "wine_bar", label: "Anggur" },
      { icon: "local_cafe", label: "Kafe" },
      { icon: "kitchen", label: "Dapur" }
    ]
  },
  {
    title: "Ritel & Belanja",
    icons: [
      { icon: "storefront", label: "Toko" },
      { icon: "sell", label: "Jual" },
      { icon: "local_mall", label: "Mal" },
      { icon: "payments", label: "Bayar" },
      { icon: "shopping_bag", label: "Tas" },
      { icon: "shopping_cart", label: "Keranjang" },
      { icon: "point_of_sale", label: "POS" },
      { icon: "receipt_long", label: "Struk" },
      { icon: "price_check", label: "Harga" },
      { icon: "card_giftcard", label: "Hadiah" },
      { icon: "shopping_basket", label: "Belanja" },
      { icon: "inventory_2", label: "Inventori" },
      { icon: "barcode", label: "Barcode" },
      { icon: "qr_code", label: "QR" },
      { icon: "wallet", label: "Dompet" },
      { icon: "account_balance", label: "Bank" },
      { icon: "currency_exchange", label: "Tukar" }
    ]
  },
  {
    title: "Elektronik",
    icons: [
      { icon: "computer", label: "Komputer" },
      { icon: "smartphone", label: "HP" },
      { icon: "headphones", label: "Headset" },
      { icon: "watch", label: "Jam" },
      { icon: "laptop_mac", label: "Laptop" },
      { icon: "tablet", label: "Tablet" },
      { icon: "tv", label: "TV" },
      { icon: "camera_alt", label: "Kamera" },
      { icon: "speaker", label: "Speaker" },
      { icon: "memory", label: "Memori" },
      { icon: "keyboard", label: "Keyboard" },
      { icon: "mouse", label: "Mouse" },
      { icon: "print", label: "Printer" },
      { icon: "scanner", label: "Scanner" },
      { icon: "monitor", label: "Monitor" },
      { icon: "power", label: "Daya" },
      { icon: "battery_charging_full", label: "Baterai" },
      { icon: "cable", label: "Kabel" },
      { icon: "router", label: "Router" },
      { icon: "devices", label: "Perangkat" }
    ]
  },
  {
    title: "Fashion & Aksesoris",
    icons: [
      { icon: "checkroom", label: "Pakaian" },
      { icon: "dry_cleaning", label: "Laundry" },
      { icon: "laundry", label: "Cuci" },
      { icon: "styler", label: "Styler" },
      { icon: "diamond", label: "Berlian" },
      { icon: "watch", label: "Jam" },
      { icon: "wallet", label: "Dompet" },
      { icon: "backpack", label: "Tas" },
      { icon: "luggage", label: "Koper" },
      { icon: "diamond", label: "Aksesoris" },
      { icon: "umbrella", label: "Payung" }
    ]
  },
  {
    title: "Rumah & Kebun",
    icons: [
      { icon: "home", label: "Rumah" },
      { icon: "chair", label: "Kursi" },
      { icon: "bed", label: "Tidur" },
      { icon: "light", label: "Lampu" },
      { icon: "potted_plant", label: "Tanaman" },
      { icon: "local_florist", label: "Bunga" },
      { icon: "yard", label: "Halaman" },
      { icon: "grass", label: "Rumput" },
      { icon: "deck", label: "Dek" },
      { icon: "fence", label: "Pagar" },
      { icon: "roofing", label: "Atap" },
      { icon: "window", label: "Jendela" },
      { icon: "door_front", label: "Pintu" },
      { icon: "garage", label: "Garasi" },
      { icon: "vacuum", label: "Sapu" },
      { icon: "kitchen", label: "Dapur" },
      { icon: "bathtub", label: "Bath" },
      { icon: "shower", label: "Shower" }
    ]
  },
  {
    title: "Olahraga & Kebugaran",
    icons: [
      { icon: "fitness_center", label: "Gym" },
      { icon: "sports_soccer", label: "Sepak Bola" },
      { icon: "sports_basketball", label: "Basket" },
      { icon: "sports_tennis", label: "Tenis" },
      { icon: "sports_volleyball", label: "Voli" },
      { icon: "sports_baseball", label: "Baseball" },
      { icon: "sports_golf", label: "Golf" },
      { icon: "sports_esports", label: "Game" },
      { icon: "sports_kabaddi", label: "Beladiri" },
      { icon: "sports_hockey", label: "Hoki" },
      { icon: "sports_cricket", label: "Kriket" },
      { icon: "snowboarding", label: "Snow" },
      { icon: "skateboarding", label: "Skate" },
      { icon: "directions_run", label: "Lari" },
      { icon: "directions_bike", label: "Bike" },
      { icon: "pool", label: "Renang" },
      { icon: "hiking", label: "Hiking" }
    ]
  },
  {
    title: "Kesehatan & Kecantikan",
    icons: [
      { icon: "health_and_safety", label: "Sehat" },
      { icon: "medical_services", label: "Medis" },
      { icon: "local_hospital", label: "RS" },
      { icon: "vaccines", label: "Vaksin" },
      { icon: "pill", label: "Obat" },
      { icon: "stethoscope", label: "Stetoskop" },
      { icon: "biotech", label: "Bio" },
      { icon: "face", label: "Wajah" },
      { icon: "spa", label: "Spa" },
      { icon: "soap", label: "Sabun" },
      { icon: "massage", label: "Pijat" }
    ]
  },
  {
    title: "Hiburan & Media",
    icons: [
      { icon: "theater_comedy", label: "Teater" },
      { icon: "celebration", label: "Pesta" },
      { icon: "auto_stories", label: "Buku" },
      { icon: "brush", label: "Seni" },
      { icon: "music_note", label: "Musik" },
      { icon: "movie", label: "Film" },
      { icon: "videogame_asset", label: "Game" },
      { icon: "piano", label: "Piano" },
      { icon: "palette", label: "Lukis" },
      { icon: "mic", label: "Mikrofon" },
      { icon: "album", label: "Album" },
      { icon: "live_tv", label: "TV" },
      { icon: "podcasts", label: "Podcast" },
      { icon: "library_music", label: "Musik" },
      { icon: "party_mode", label: "Pesta" },
      { icon: "sports_esports", label: "Game" }
    ]
  },
  {
    title: "Transportasi",
    icons: [
      { icon: "directions_car", label: "Mobil" },
      { icon: "local_shipping", label: "Kirim" },
      { icon: "airport_shuttle", label: "Shuttle" },
      { icon: "two_wheeler", label: "Motor" },
      { icon: "pedal_bike", label: "Sepeda" },
      { icon: "flight", label: "Pesawat" },
      { icon: "directions_boat", label: "Kapal" },
      { icon: "train", label: "Kereta" },
      { icon: "bus_alert", label: "Bus" },
      { icon: "taxi_alert", label: "Taksi" },
      { icon: "ev_station", label: "Charger" },
      { icon: "local_gas_station", label: "Bensin" },
      { icon: "toll", label: "Tol" },
      { icon: "car_rental", label: "Sewa" }
    ]
  },
  {
    title: "Bisnis & Keuangan",
    icons: [
      { icon: "account_balance", label: "Bank" },
      { icon: "payments", label: "Bayar" },
      { icon: "currency_exchange", label: "Tukar" },
      { icon: "analytics", label: "Analitik" },
      { icon: "bar_chart", label: "Grafik" },
      { icon: "monitoring", label: "Monitor" },
      { icon: "receipt", label: "Nota" },
      { icon: "request_quote", label: "Invoice" },
      { icon: "savings", label: "Tabung" },
      { icon: "account_balance_wallet", label: "Dompet" },
      { icon: "paid", label: "Dana" },
      { icon: "trending_up", label: "Naik" },
      { icon: "trending_down", label: "Turun" },
      { icon: "business", label: "Bisnis" },
      { icon: "corporate_fare", label: "Kantor" },
      { icon: "real_estate_agent", label: "Properti" }
    ]
  },
  {
    title: "Pendidikan & Seni",
    icons: [
      { icon: "school", label: "Sekolah" },
      { icon: "auto_stories", label: "Buku" },
      { icon: "brush", label: "Lukis" },
      { icon: "palette", label: "Palet" },
      { icon: "music_note", label: "Musik" },
      { icon: "piano", label: "Piano" },
      { icon: "theater_comedy", label: "Teater" },
      { icon: "stadia_controller", label: "Game" },
      { icon: "architecture", label: "Arsitek" },
      { icon: "calculate", label: "Hitung" },
      { icon: "science", label: "Sains" },
      { icon: "biotech", label: "Bio" },
      { icon: "menu_book", label: "Buku" },
      { icon: "history", label: "Sejarah" },
      { icon: "translate", label: "Bahasa" },
      { icon: "draw", label: "Gambar" }
    ]
  },
  {
    title: "Hewan & Alam",
    icons: [
      { icon: "pets", label: "Hewan" },
      { icon: "park", label: "Taman" },
      { icon: "forest", label: "Hutan" },
      { icon: "local_florist", label: "Bunga" },
      { icon: "potted_plant", label: "Tanaman" },
      { icon: "grass", label: "Rumput" },
      { icon: "yard", label: "Halaman" },
      { icon: "water_drop", label: "Air" },
      { icon: "beach_access", label: "Pantai" },
      { icon: "landscape", label: "Alam" },
      { icon: "sunny", label: "Cerah" },
      { icon: "ac_unit", label: "Dingin" },
      { icon: "whatshot", label: "Panas" },
      { icon: "thunderstorm", label: "Badai" }
    ]
  },
  {
    title: "Peralatan & Konstruksi",
    icons: [
      { icon: "construction", label: "Bangun" },
      { icon: "hardware", label: "Hardware" },
      { icon: "plumbing", label: "Pipa" },
      { icon: "electrical_services", label: "Listrik" },
      { icon: "handyman", label: "Tukang" },
      { icon: "build", label: "Buat" },
      { icon: "hardware", label: "Alat" },
      { icon: "key", label: "Kunci" },
      { icon: "roofing", label: "Atap" },
      { icon: "fence", label: "Pagar" }
    ]
  },
  {
    title: "Layanan & Profesi",
    icons: [
      { icon: "support_agent", label: "CS" },
      { icon: "room_service", label: "Servis" },
      { icon: "cleaning_services", label: "Bersih" },
      { icon: "laundry", label: "Cuci" },
      { icon: "dry_cleaning", label: "Kering" },
      { icon: "security", label: "Aman" },
      { icon: "gavel", label: "Hukum" },
      { icon: "account_balance", label: "Bank" },
      { icon: "real_estate_agent", label: "Properti" },
      { icon: "flight_takeoff", label: "Terbang" },
      { icon: "hotel", label: "Hotel" },
      { icon: "local_hospital", label: "RS" },
      { icon: "local_fire_department", label: "Damkar" },
      { icon: "local_police", label: "Polisi" },
      { icon: "elderly", label: "Lansia" },
      { icon: "child_care", label: "Anak" }
    ]
  }
];

export const quickIcons: string[] = [
  "fastfood",
  "coffee",
  "shopping_bag",
  "devices",
  "checkroom",
  "home",
  "restaurant",
  "more_horiz"
];

export const allMappedIcons: IconOption[] = [
  ...new Map(
    iconSections.flatMap((section) => section.icons).map((ic) => [ic.icon, ic])
  ).values()
];