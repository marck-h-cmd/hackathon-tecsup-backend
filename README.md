# Hackathon Backend - Plataforma Educativa

Backend para plataforma educativa con autenticación Clerk, base de datos híbrida (MySQL + MongoDB), y sistema de gestión de estudiantes, cursos y sesiones de tutoría.

---

## 🚀 Tecnologías Utilizadas

### Core
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Lenguaje de programación
- **ts-node-dev** - Desarrollo con hot reload

### Bases de Datos
- **MySQL** (Sequelize) - Base de datos relacional para datos estructurados
- **MongoDB** (Mongoose) - Base de datos NoSQL para sesiones de tutoría

### Autenticación y Seguridad
- **Clerk** - Autenticación y gestión de usuarios
- **bcrypt** - Hash de contraseñas
- **JWT** - Tokens de autenticación (vía Clerk)

### Utilidades
- **dotenv** - Variables de entorno
- **cors** - Configuración CORS
- **cookie-parser** - Manejo de cookies
- **multer** - Manejo de archivos
- **AWS SDK** - Integración con S3
- **MailerSend** - Servicio de emails
- **uuid** - Generación de IDs únicos

---

## 📁 Estructura del Proyecto

```
src/
├── config/              # Configuración de bases de datos
│   └── database.ts      # Conexiones MySQL y MongoDB
├── controllers/         # Controladores de rutas
│   └── User.ts          # Controlador de usuarios
├── dao/                 # Data Access Object (Acceso a datos)
│   └── User.ts          # Lógica de acceso a datos de usuarios
├── interfaces/          # Interfaces TypeScript
│   ├── mysql/           # Interfaces para modelos MySQL
│   │   ├── User.ts
│   │   ├── Curso.ts
│   │   ├── PerfilEstudiante.ts
│   │   ├── Tema.ts
│   │   ├── Seccion.ts
│   │   ├── Ejercicio.ts
│   │   ├── Reward.ts
│   │   └── Streak.ts
│   ├── mongodb/         # Interfaces para modelos MongoDB
│   │   └── SesionTutoria.ts
│   └── shared/          # Interfaces compartidas
│       ├── enums.ts     # Enumeraciones
│       └── types.ts     # Tipos compartidos
├── middleware/          # Middlewares
│   ├── auth.ts          # Autenticación Clerk (estudiantes)
│   └── authAdmin.ts     # Autenticación Admin
├── models/              # Modelos de bases de datos
│   ├── mysql/           # Modelos Sequelize (MySQL)
│   │   ├── User.ts
│   │   ├── Curso.ts
│   │   ├── PerfilEstudiante.ts
│   │   ├── Tema.ts
│   │   ├── Seccion.ts
│   │   ├── Ejercicio.ts
│   │   ├── Reward.ts
│   │   └── Streak.ts
│   ├── mongodb/         # Modelos Mongoose (MongoDB)
│   │   └── SesionTutoria.ts
│   └── index.ts         # Exportación de modelos
├── routes/              # Rutas de la API
│   └── User.ts          # Rutas de usuarios
├── scripts/             # Scripts auxiliares
│   └── InitAdmin.ts     # Inicialización de usuario admin
├── services/            # Lógica de negocio
│   └── User.ts          # Servicios de usuarios
├── types/               # Tipos personalizados
│   └── multer.d.ts      # Tipos para Multer
└── app.ts               # Archivo principal de la aplicación
```

---

## 📦 Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- MongoDB (v6.0 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/marck-h-cmd/hackathon-tecsup-backend.git
cd hackathon-tecsup-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto:
```env
# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=plataforma_educativa
MYSQL_USER=root
MYSQL_PASSWORD=your_password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/plataforma_educativa

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key

# Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# AWS S3 (opcional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name

# MailerSend (opcional)
MAILERSEND_API_KEY=your_mailersend_api_key
```

4. **Configurar bases de datos**

**MySQL:**
```sql
CREATE DATABASE plataforma_educativa;
```

**MongoDB:**
MongoDB se creará automáticamente al conectar. Asegúrate de que el servicio esté corriendo.

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

6. **Compilar TypeScript**
```bash
npm run build
```

7. **Ejecutar en producción**
```bash
npm start
```

---

## 🗄️ Modelos de Base de Datos

### MySQL (Sequelize)

#### User
- Gestión de usuarios (estudiantes y administradores)
- Autenticación con Clerk
- Tipos: `estudiante`, `admin`

#### PerfilEstudiante
- Perfil académico del estudiante
- Información institucional
- Preferencias de aprendizaje
- Sistema de puntos y niveles
- Streaks de estudio

#### Curso
- Cursos educativos
- Configuración de cursos públicos/privados
- Duración estimada
- Colores y imágenes

#### Tema
- Temas dentro de cursos
- Niveles de dificultad
- Contenido educativo

#### Seccion
- Secciones dentro de temas
- Orden y organización

#### Ejercicio
- Ejercicios de práctica
- Tipos: múltiple opción, código, texto, selección, relacionar
- Niveles de dificultad

#### Reward
- Sistema de recompensas
- Badges e insignias
- Puntos y categorías

#### Streak
- Sistema de rachas de estudio
- Seguimiento de actividad diaria

### MongoDB (Mongoose)

#### SesionTutoria
- Sesiones de tutoría con IA
- Mensajes entre estudiante y sistema
- Historial de conversaciones
- Duración y fechas

---

## 🔐 Autenticación

### Clerk (Estudiantes)
- Autenticación mediante tokens JWT de Clerk
- Middleware: `authenticateClerkToken`
- Verificación de usuarios en rutas protegidas

### Admin
- Autenticación con email y contraseña
- Middleware: `authenticateAdminToken`
- Usuario admin se crea automáticamente al iniciar la aplicación

---

## 🛠️ Funcionalidades Principales

### Gestión de Usuarios
- Crear usuarios (estudiantes)
- Obtener usuario por ID o email
- Verificar existencia de usuarios
- Actualizar información de usuarios
- Desactivar usuarios
- Listar usuarios con filtros y paginación

### Perfil de Estudiante
- Crear perfil de estudiante
- Obtener perfil por ID de usuario
- Actualizar perfil
- Sistema de puntos de experiencia
- Niveles de experiencia
- Streaks de estudio

### Administración
- Crear usuario administrador
- Verificar credenciales de admin
- Estadísticas de usuarios
- Top estudiantes por experiencia

### Sesiones de Tutoría IA (MongoDB)
- Gestión de sesiones de tutoría
- Mensajes y conversaciones 
- Historial de sesiones

---

## 📡 Endpoints de API

### Usuarios
```
GET  /user/verifyUser/:userId  - Verificar usuario (requiere autenticación Clerk)
```

### Health Check
```
GET  /health  - Verificar estado del servidor
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

---

## 🏗️ Arquitectura

### Capas de la Aplicación

1. **Routes** - Definición de endpoints
2. **Controllers** - Manejo de requests y responses
3. **Services** - Lógica de negocio
4. **DAO** - Acceso a datos (Data Access Object)
5. **Models** - Modelos de bases de datos
6. **Interfaces** - Tipos TypeScript

### Patrón de Respuesta

Todas las respuestas de la API siguen el formato:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Paginación

```typescript
interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## 🔄 Inicialización Automática

Al iniciar la aplicación, se ejecuta automáticamente:
- Conexión a MySQL y MongoDB
- Sincronización de modelos (solo en desarrollo)
- Creación de usuario administrador (si no existe)

El usuario admin se crea con:
- Email: `ADMIN_EMAIL` (env) o `admin@gmail.com`
- Password: `ADMIN_PASSWORD` (env) o `admin123`
- Tipo: `admin`

---

## 🌐 Variables de Entorno

### Requeridas
- `MYSQL_HOST` - Host de MySQL
- `MYSQL_DATABASE` - Nombre de la base de datos
- `MYSQL_USER` - Usuario de MySQL
- `MYSQL_PASSWORD` - Contraseña de MySQL
- `MONGODB_URI` - URI de conexión a MongoDB
- `CLERK_SECRET_KEY` - Clave secreta de Clerk

### Opcionales
- `PORT` - Puerto del servidor (default: 4000)
- `NODE_ENV` - Entorno (development/production)
- `FRONTEND_URL` - URL del frontend para CORS
- `ADMIN_EMAIL` - Email del admin (default: admin@gmail.com)
- `ADMIN_PASSWORD` - Password del admin (default: admin123)

---

## 📊 Enumeraciones (Enums)

### TipoUsuario
- `ESTUDIANTE` - Usuario estudiante
- `ADMIN` - Usuario administrador

### TipoInstitucion
- `UNIVERSIDAD`
- `INSTITUTO`
- `ESCUELA_SUPERIOR`

### EstiloAprendizaje
- `VISUAL`
- `AUDITIVO`
- `KINESTESICO`
- `LECTURA_ESCRITURA`

### NivelDificultad
- `BASICO`
- `INTERMEDIO`
- `AVANZADO`
- `ESPECIALIZADO`

### TipoEjercicio
- `MULTIPLE` - Opción múltiple
- `CODIGO` - Ejercicio de código
- `TEXTO` - Respuesta de texto
- `SELECCION` - Selección
- `RELACIONAR` - Relacionar elementos

### TipoReward
- `BADGE` - Insignia
- `PUNTOS` - Puntos
- `INSIGNIA` - Insignia especial

---

## 🐛 Troubleshooting

### Error: "Please install mysql2 package manually"
```bash
npm install mysql2 sequelize
```

### Error de conexión a MySQL
- Verificar que MySQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos exista

### Error de conexión a MongoDB
- Verificar que MongoDB esté corriendo
- Verificar `MONGODB_URI` en `.env`

### Error de autenticación Clerk
- Verificar `CLERK_SECRET_KEY` en `.env`
- Verificar que el token sea válido

---

## 📝 Notas de Desarrollo

- Los modelos se sincronizan automáticamente en desarrollo (`alter: true`)
- El usuario admin se crea automáticamente si no existe
- Las contraseñas se hashean con bcrypt (12 rounds)
- Los timestamps se manejan automáticamente en MySQL
- MongoDB se usa para datos no estructurados (sesiones de tutoría)

---

## 📄 Licencia

Ver archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Contribuidores

- Desarrollo inicial del proyecto

---

## 🔗 Enlaces Útiles

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/)
