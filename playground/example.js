// example.js — ✅ EDITABLE, experimentá acá



// ── Tabla con scroll ──

const tabla = document.getElementById('tabla');

const productos = [
  'Laptop ThinkPad X1', 'Monitor 27" 4K', 'Teclado Mecánico', 'Mouse Inalámbrico', 'Webcam HD',
  'Audífonos Bluetooth', 'Hub USB-C', 'SSD 1TB NVMe', 'Memoria RAM 32GB', 'Fuente 750W',
  'Cable HDMI 2.1', 'Base para laptop', 'Silla Ergonómica', 'Escritorio Eléctrico', 'Lámpara LED',
  'Tablet Galaxy Tab', 'iPhone 15 Pro', 'MacBook Air M3', 'iPad Air', 'Apple Watch Ultra',
  'Cargador 65W USB-C', 'Adaptador DisplayPort', 'Mousepad XXL', 'Micrófono USB', 'Interfaz de Audio',
  'Cámara Sony Alpha', 'Lente 50mm f/1.8', 'Trípode de Viaje', 'DJI Osmo Pocket', 'GoPro Hero 12',
  'Kindle Paperwhite', 'Alexa Echo Dot', 'Google Nest Hub', 'Philips Hue Kit', 'Termostato Inteligente',
  'Router WiFi 6', 'Switch 8 Puertos', 'NAS 2 Bahías', 'UPS 1500VA', 'Cable RJ45 10m',
  'Proyector 1080p', 'Pantalla 120"', 'Parlante Portátil', 'Subwoofer 12"', 'Amplificador',
  'Vinilo Led Zeppelin', 'Guitarra Eléctrica', 'Batería Electrónica', 'Teclado 61 teclas', 'Monitor de Estudio',
];

const categorias = ['Electrónica', 'Oficina', 'Audio', 'Video', 'Redes'];
const estados = ['Disponible', 'En uso', 'En reparación', 'Agotado'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

tabla.columns = [
  { key: 'codigo', label: 'Código', width: '100px' },
  { key: 'producto', label: 'Producto', width: '250px' },
  { key: 'categoria', label: 'Categoría', width: '120px' },
  { key: 'stock', label: 'Stock', width: '80px', align: 'center' },
  { key: 'precio', label: 'Precio', width: '100px', align: 'center' },
  { key: 'estado', label: 'Estado', width: '140px' },
];

tabla.data = Array.from({ length: 50 }, (_, i) => ({
  codigo: `P-${String(i + 1).padStart(3, '0')}`,
  producto: productos[i],
  categoria: rand(categorias),
  stock: Math.floor(Math.random() * 50),
  precio: `$${(Math.random() * 2000 + 100).toFixed(2)}`,
  estado: rand(estados),
}));

logEvent(`Tabla cargada con ${tabla.data.length} registros`);
