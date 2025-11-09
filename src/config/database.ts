import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// CONFIGURACIÓN MYSQL (SEQUELIZE)
// ============================================

export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'plataforma_educativa',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    },
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    timezone: '-05:00' // Ajusta según tu zona horaria
  }
);

// ============================================
// CONFIGURACIÓN MONGODB (MONGOOSE)
// ============================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/plataforma_educativa';

export const mongooseConnection = mongoose.connection;

// Configurar opciones de Mongoose
mongoose.set('strictQuery', true);

// Eventos de conexión de MongoDB
mongooseConnection.on('connected', () => {
  console.log('✅ Mongoose conectado a MongoDB');
});

mongooseConnection.on('error', (err) => {
  console.error('❌ Error de conexión MongoDB:', err);
});

mongooseConnection.on('disconnected', () => {
  console.log('⚠️  Mongoose desconectado de MongoDB');
});

// Manejar cierre graceful
process.on('SIGINT', async () => {
  await mongooseConnection.close();
  console.log('🔌 Conexión MongoDB cerrada por terminación de app');
  process.exit(0);
});

// ============================================
// FUNCIONES DE CONEXIÓN UNIFICADAS
// ============================================

export const connectMySQL = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    // Sincronizar modelos (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos MySQL sincronizados');
    }
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error);
    throw error;
  }
};

export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // Opciones recomendadas para Mongoose 6+
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1
    });
    console.log('✅ Conexión a MongoDB establecida correctamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
};

export const connectAllDatabases = async (): Promise<void> => {
  try {
    console.log('🔄 Conectando a bases de datos...');
    
    await Promise.all([
      connectMySQL(),
      connectMongoDB()
    ]);
    
    console.log('🎉 Todas las conexiones de base de datos establecidas');
  } catch (error) {
    console.error('💥 Error conectando a las bases de datos:', error);
    throw error;
  }
};

export const disconnectAllDatabases = async (): Promise<void> => {
  try {
    await Promise.all([
      sequelize.close(),
      mongooseConnection.close()
    ]);
    console.log('🔌 Todas las conexiones de base de datos cerradas');
  } catch (error) {
    console.error('❌ Error cerrando conexiones:', error);
    throw error;
  }
};

// ============================================
// HEALTH CHECKS
// ============================================

export const checkDatabaseHealth = async (): Promise<{
  mysql: boolean;
  mongodb: boolean;
  timestamp: Date;
}> => {
  const health = {
    mysql: false,
    mongodb: false,
    timestamp: new Date()
  };

  try {
    await sequelize.authenticate();
    health.mysql = true;
  } catch (error) {
    console.error('❌ Health check MySQL falló:', error);
  }

  try {
    // MongoDB health check - verificar estado de conexión
    health.mongodb = mongooseConnection.readyState === 1;
    if (!health.mongodb) {
      console.error('❌ Health check MongoDB falló - estado:', mongooseConnection.readyState);
    }
  } catch (error) {
    console.error('❌ Health check MongoDB falló:', error);
  }

  return health;
};

// ============================================
// EXPORTACIONES PRINCIPALES
// ============================================

export default {
  // MySQL
  sequelize,
  connectMySQL,
  
  // MongoDB
  mongoose: mongoose,
  mongooseConnection,
  connectMongoDB,
  
  // Funciones combinadas
  connectAllDatabases,
  disconnectAllDatabases,
  checkDatabaseHealth
};