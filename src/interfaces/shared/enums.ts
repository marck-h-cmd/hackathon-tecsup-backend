
import { ExclusionConstraintError } from "sequelize";

export enum TipoUsuario {
    ESTUDIANTE = 'estudiante',
    ADMIN = 'admin',
  }
  
  export enum TipoInstitucion {
    UNIVERSIDAD = 'universidad',
    INSTITUTO = 'instituto',
    ESCUELA_SUPERIOR = 'escuela_superior'
  }
  
  export enum EstiloAprendizaje {
    VISUAL = 'visual',
    AUDITIVO = 'auditivo',
    KINESTESICO = 'kinestesico',
    LECTURA_ESCRITURA = 'lectura_escritura'
  }
  
  export enum NivelDificultad {
    BASICO = 'basico',
    INTERMEDIO = 'intermedio',
    AVANZADO = 'avanzado',
    ESPECIALIZADO = 'especializado'
  }
  
  export enum EstadoTarea {
    PENDIENTE = 'pendiente',
    EN_PROGRESO = 'en_progreso',
    COMPLETADO = 'completado',
    RETRASADO = 'retrasado'
  }

  export enum TipoReward {
    BADGE = 'badge',
    PUNTOS = 'puntos',
    INSIGNIA = 'insignia'
  }

  export enum CategoriaReward {
    ESTUDIO = 'estudio',
    EJERCICIOS = 'ejercicios',
    STREAK = 'streak'
  }

  export enum TipoActividad {
    ESTUDIO = 'estudio',
    EJERCICIOS = 'ejercicios'
  }

  export enum HorarioPreferido{
    MAÑANA= 'mañana' ,
    TARDE = 'tarde' ,
    NOCHE= 'noche'
  }

  export enum  TipoContenido {
    TEORIA = 'teoria' ,
    EJEMPLO = 'ejemplo' ,
    VIDEO =  'video' ,
    INTERACTIVO = 'interactivo'
  }

  export enum TipoEjercicio {
     MULTIPLE = 'multiple_choice' ,
     CODIGO =  'codigo' ,
     TEXTO=  'texto',
     SELECCION = 'seleccion',
     RELACIONAR = 'relacionar'
  }


  export enum TTipoNotificacion {
    TAREA= 'tarea' ,
    VENCIMIENTO= 'vencimiento' ,
    HORARIO =  'horario' ,
    RECOMENDACION =  'recomendacion' ,
    GENERAL ='general'
  }

  export enum TPrioridad {
    BAJA = 'baja' ,
    MEDIA = 'media' ,
    ALTA =  'alta'
  }