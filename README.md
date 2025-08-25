
# template-express-clerk-mysql

Backend base para proyectos Node.js con autenticación Clerk, Express y conexión a base de datos MySQL.

---

## 🚀 Tecnologías utilizadas

- **Node.js**
- **Express.js**
- **TypeScript**
- **MySQL** (usando `mysql2`)
- **Clerk** (autenticación)
- **dotenv**

---

## 🧠 Estructura del proyecto

src/
├── config/        # Configuración de la base de datos
├── controllers/   # Controladores de rutas
├── dao/           # Acceso a datos (consultas SQL)
├── interfaces/    # Interfaces TypeScript
├── middleware/    # Middlewares de autenticación y otros
├── routes/        # Rutas de la API
├── scripts/       # Scripts auxiliares
├── services/      # Lógica de negocio
├── types/         # Tipos personalizados
├── utils/         # Utilidades
└── app.ts         # Archivo principal

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/AJoelCastro/template-express-clerk-mysql.git

# Entrar al proyecto
cd template-express-clerk-mysql

# Instalar dependencias
npm install

# Correr el programa en desarrollo
npm run dev

# Compilar TypeScript
npm run build

# Iniciar en producción
npm start
