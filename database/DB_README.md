# 🗄️ Base de Datos ControlStock

## Cómo recrear la base de datos manualmente

Esto solo es necesario si **no usas Docker** o si quieres resetear los datos.

### 1. Crear la base de datos

En **psql** o tu cliente SQL favorito:

```sql
CREATE DATABASE controlstockdb;
```

### 2. Conéctate a la base de datos `controlstockdb`

```sql
\c controlstockdb;
```

### 3. Crear las tablas

Ejecuta el archivo [`1-create_tables.sql`](1-create_tables.sql):

```bash
psql -U admin -d controlstockdb -f 1-create_tables.sql
```

### 4. Cargar datos de ejemplo

Ejecuta el archivo [`2-seed_data.sql`](2-seed_data.sql):

```bash
psql -U admin -d controlstockdb -f 2-seed_data.sql
```

---

> 💡 **Si usas Docker modo producción**, los scripts se ejecutan solos. No necesitas hacer esto.