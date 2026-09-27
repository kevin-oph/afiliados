import pandas as pd

# Cargar tu archivo Excel actual
df = pd.read_excel('CONCETRADO_AFILIACIONES_LITO.xlsx') # O el nombre exacto de tu archivo

# Limpiar columna de líderes
df['LIDER'] = df['LIDER'].astype(str).str.strip().str.upper()

# Contar registros por cada líder para saber el volumen de cada variante
resumen_lideres = df['LIDER'].value_counts().reset_index()
resumen_lideres.columns = ['NOMBRE_LIDER', 'TOTAL_REGISTROS']

# Exportar a un archivo CSV para que puedas revisarlo, editarlo o verlo cómodamente en Excel
resumen_lideres.to_csv('lista_lideres_para_auditoria.csv', index=False, encoding='utf-8-sig')

print(f"¡Se han exportado {len(resumen_lideres)} líderes únicos al archivo 'lista_lideres_para_auditoria.csv'!")