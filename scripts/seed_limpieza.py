import pandas as pd

print("Iniciando proceso de unificación y limpieza de líderes...")

# 1. Cargar el padrón principal de afiliados
df_afiliados = pd.read_excel('CONCETRADO_AFILIACIONES_LITO.xlsx')
df_afiliados.columns = df_afiliados.columns.str.strip().str.upper()

# 2. Cargar tu archivo CSV de líderes limpios
try:
    df_lideres_limpios = pd.read_csv('lista_lideres_para_auditoria.csv', encoding='latin1')
    df_lideres_limpios.columns = df_lideres_limpios.columns.str.strip().str.upper()
    print(f"¡Archivo 'lista_lideres_para_auditoria.csv' cargado con éxito ({len(df_lideres_limpios)} registros)!")
except Exception as e:
    print(f"Error al leer el archivo: {e}")

# 3. Estandarizar columnas principales de afiliados
df_afiliados['LIDER'] = df_afiliados['LIDER'].astype(str).str.strip().str.upper()
df_afiliados['NOMBRE'] = df_afiliados['NOMBRE'].astype(str).str.strip().str.upper()
if 'COLONIA' in df_afiliados.columns:
    df_afiliados['COLONIA'] = df_afiliados['COLONIA'].astype(str).str.strip().str.upper()

df_afiliados = df_afiliados.fillna('')

# 4. PASO CLAVE: Si en tu archivo de Excel modificaste los nombres y quieres que 
# el padrón general refleje esos cambios de manera limpia y estandarizada:
# Limpiamos espacios dobles y caracteres extraños en los nombres de los líderes
df_afiliados['LIDER'] = df_afiliados['LIDER'].str.replace(r'\s+', ' ', regex=True)

print(f"Padrón procesado. Total de registros: {len(df_afiliados)}")
print(f"Total de líderes únicos en el padrón depurado: {df_afiliados['LIDER'].nunique()}")

# 5. Exportar el JSON actualizado a la carpeta pública de tu proyecto de React
output_path = '../dashboard-afiliaciones/public/data/datos_afiliaciones.json'
df_afiliados.to_json(output_path, orient='records', force_ascii=False, indent=4)

print(f"¡Proceso finalizado con éxito! Archivo JSON actualizado en: {output_path}")