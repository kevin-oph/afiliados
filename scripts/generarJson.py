import pandas as pd
import os

print("Iniciando generación del JSON maestro desde AFILIADOS_ARREGLADOS.xlsx...")

# 1. Nombre del archivo Excel corregido y la hoja oficial
excel_path = 'AFILIADOS_ARREGLADOS.xlsx'
sheet_name = 'CONCENTRADO_CORREGIDO'

# 2. Leer el Excel saltándose las primeras 2 filas de títulos decorativos
df = pd.read_excel(excel_path, sheet_name=sheet_name, skiprows=2)

# 3. Eliminar columnas vacías o 'Unnamed' si las hubiera
df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

# 4. Estandarizar y limpiar todas las celdas de texto
for col in df.columns:
    df[col] = df[col].astype(str).str.strip().str.upper()
    df[col] = df[col].replace('NAN', '')

df = df.fillna('')

print(f"Total de registros cargados: {len(df)}")
print(f"Total de líderes únicos: {df['LIDER'].nunique()}")

# 5. Asegurar que exista la carpeta public/data y guardar el JSON
output_dir = '../public/data' # Si estás dentro de la carpeta scripts/
# (Si estás en la raíz del proyecto, cámbialo simplemente a 'public/data')
if not os.path.exists('../public'):
    output_dir = 'public/data'

os.makedirs(output_dir, exist_ok=True)
json_path = os.path.join(output_dir, 'datos_afiliaciones.json')

# Exportar a JSON
df.to_json(json_path, orient='records', force_ascii=False, indent=4)

print(f"¡ÉXITO! Archivo JSON generado correctamente en: {os.path.abspath(json_path)}")