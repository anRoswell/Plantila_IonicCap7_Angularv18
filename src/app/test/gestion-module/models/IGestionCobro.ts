import { TypeState } from "src/app/core/enums/TypeState";
import { IGeolocation } from "src/app/core/interfaces/IGeolocation";
import { IPhoto } from "src/app/core/interfaces/IPhoto";

// contenedor bd local
export interface IContainerDbGC {
  id: number;
  id_record: number;
  id_contratista_persona: number;
  estado: TypeState;
  mensaje?: string;
  log?: string;
  fecha: string;
  informacion: any;
  gestion?: any;
}

// modelos para la gestion de cobro
export interface IGestionCobro {
  informacion: IGCInformation;
  gestion?: IGCGestion;
}

export interface IGCInformation {
  id_plan_cliente: number;
  nic: string;
  nis: string;
  nombre_zona: string;
  nombre_cliente: string;
  telefono: string;
  estado_suministro: string;
  tarifa: string;
  descripcion_plan: string;
  nombre_municipio: string;
  localidad: string;
  direccion: string;
  numero_medidor: string;
  marca_medidor: string;
  deuda_irregular: number;
  deuda_financiada_energia: number;
  descuento_pago_contado: number;
  descuento_pago_financiado: number;
  deuda_energia: number;
  deuda_terceros: number;
  total_deuda: number;
  total_facturas: number;
  meta_recaudo: number;
  codigo_estado: string;
  fecha_asignacion_gestor: string;
  id_plan_tipo: number;
}

export interface IGCGestion {
  gestion: IGCGestion_Gestion;
  medidor: IGCGestion_Medidor;
  recaudo: IGCGestion_Recaudo;
  contacto: IGCGestion_Contacto;
  actividad: IGCGestion_Actividad;
  captura: IGCGestion_Captura;
  georreferencia: IGeolocation;
}

export interface IGCGestion_Gestion {
  id_gestion: number;
  id_resultado: number;
  id_anomalia: number;
}

export interface IGCGestion_Medidor {
  ind_lectura_medidor: string;
  lectura_medidor: number;
  id_razon_no_lectura: number;
  id_alarma_suministro: number;
}

export interface IGCGestion_Recaudo {
  valor_recaudo: number;
  fecha_pago: string;
  fecha_compromiso_pago: string;
  id_entidad_recaudadora: number;
}

export interface IGCGestion_Contacto {
  ind_persona_contacto: string;
  nombre_contacto: string;
  ind_cedula: string;
  cedula_contacto: string;
  ind_telefono: string;
  telefono_contacto: string;
  ind_email: string;
  correo_contacto: string;
}

export interface IGCGestion_Actividad {
  id_tipo_vivienda: number;
  id_actividad_economica: number;
  id_tipo_actividad_comercial: number;
}

export interface IGCGestion_Captura {
  observaciones: string;
  fecha_gestion: string;
  id_plan_cliente: number;
  id_contratista_persona: number;
  ind_captura_fotos: string;
  fotos: IPhoto[];
}

// modelos de parametros
export interface IGCGestion {
  id_gestion: number;
  nombre: string;
  ind_configuracion_general: string;
  id_plan_tipo: number;
}

export interface IGCResultado {
  id_resultado: number;
  nombre: string;
  id_gestion: number;
}