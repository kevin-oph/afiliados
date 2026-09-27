import pandas as pd
import os

print("Iniciando unificación robusta de líderes...")

# 1. Cargar el padrón principal de afiliados (10,283 registros)
df_afiliados = pd.read_excel('CONCETRADO_AFILIACIONES_LITO.xlsx')
df_afiliados.columns = df_afiliados.columns.str.strip().str.upper()

# 2. Cargar tu archivo Excel limpio con los líderes corregidos
df_lideres_limpios = pd.read_excel('lideres limpio.xlsx')
df_lideres_limpios.columns = df_lideres_limpios.columns.str.strip().str.upper()

# 3. Estandarizar columnas de texto
df_afiliados['LIDER'] = df_afiliados['LIDER'].astype(str).str.strip().str.upper()
df_afiliados['NOMBRE'] = df_afiliados['NOMBRE'].astype(str).str.strip().str.upper()
if 'COLONIA' in df_afiliados.columns:
    df_afiliados['COLONIA'] = df_afiliados['COLONIA'].astype(str).str.strip().str.upper()

df_afiliados = df_afiliados.fillna('')

print(f"Total de registros en el padrón: {len(df_afiliados)}")

# 4. Crear el diccionario de reemplazo directo basado en los nombres originales únicos
# Ordenamos alfabéticamente ambos conjuntos de manera segura para hacer el cruce 1 a 1 exacto
orig_list = sorted(df_afiliados['LIDER'].unique())
clean_list = df_lideres_limpios['NOMBRE_LIDER'].astype(str).str.strip().str.upper().tolist()

mapping_dict = {}
for i, orig in enumerate(orig_list):
    if i < len(clean_list):
        mapping_dict[orig] = clean_list[i]
    else:
        mapping_dict[orig] = orig

# Aplicar el mapeo conservando los bloques de afiliados
df_afiliados['LIDER'] = df_afiliados['LIDER'].map(mapping_dict).fillna(df_afiliados['LIDER'])

print(f"¡Líderes únicos finales unificados: {df_afiliados['LIDER'].nunique()}!")

# 5. Guardar el JSON resultante directamente en la carpeta pública de tu dashboard de React
output_dir = '../public/data'
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'datos_afiliaciones.json')

df_afiliados.to_json(output_path, orient='records', force_ascii=False, indent=4)

print(f"¡Listo! Archivo JSON generado correctamente en: {output_path}")