import sqlite3
from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.responses import HTMLResponse

app = FastAPI(title="IS2000 Modernized API & Dashboard", version="2.1")

DB_PATH = "is2000.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/stats")
def get_stats():
    conn = get_db()
    cursor = conn.cursor()
    def count_table(table):
        try:
            return cursor.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        except Exception:
            return 0
    stats = {
        "stock": count_table("stock"),
        "customers": count_table("cust"),
        "suppliers": count_table("supp"),
        "sales": count_table("jual"),
        "purchases": count_table("beli"),
    }
    conn.close()
    return stats

# --- STOCK CRUD ---
@app.get("/api/stock")
def get_stock(q: str = Query(None), limit: int = 100, offset: int = 0):
    conn = get_db()
    cursor = conn.cursor()
    if q:
        query = "SELECT * FROM stock WHERE BARA LIKE ? OR NAMA LIKE ? LIMIT ? OFFSET ?"
        params = (f"%{q}%", f"%{q}%", limit, offset)
    else:
        query = "SELECT * FROM stock LIMIT ? OFFSET ?"
        params = (limit, offset)
    rows = [dict(row) for row in cursor.execute(query, params).fetchall()]
    conn.close()
    return rows

@app.post("/api/stock")
def add_stock(data: dict = Body(...)):
    conn = get_db()
    cursor = conn.cursor()
    keys = list(data.keys())
    values = list(data.values())
    cols = ", ".join([f'"{k}"' for k in keys])
    placeholders = ", ".join(["?"] * len(keys))
    try:
        cursor.execute(f"INSERT INTO stock ({cols}) VALUES ({placeholders})", values)
        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    return {"status": "success"}

@app.put("/api/stock/{bara}")
def update_stock(bara: str, data: dict = Body(...)):
    conn = get_db()
    cursor = conn.cursor()
    set_clause = ", ".join([f'"{k}" = ?' for k in data.keys()])
    values = list(data.values()) + [bara]
    try:
        cursor.execute(f"UPDATE stock SET {set_clause} WHERE BARA = ?", values)
        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    return {"status": "success"}

@app.delete("/api/stock/{bara}")
def delete_stock(bara: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM stock WHERE BARA = ?", (bara,))
    conn.commit()
    conn.close()
    return {"status": "success"}

# --- CUSTOMER CRUD ---
@app.get("/api/cust")
def get_customers(q: str = Query(None), limit: int = 100, offset: int = 0):
    conn = get_db()
    cursor = conn.cursor()
    if q:
        query = "SELECT * FROM cust WHERE KODE LIKE ? OR NAMA LIKE ? LIMIT ? OFFSET ?"
        params = (f"%{q}%", f"%{q}%", limit, offset)
    else:
        query = "SELECT * FROM cust LIMIT ? OFFSET ?"
        params = (limit, offset)
    rows = [dict(row) for row in cursor.execute(query, params).fetchall()]
    conn.close()
    return rows

@app.post("/api/cust")
def add_customer(data: dict = Body(...)):
    conn = get_db()
    cursor = conn.cursor()
    keys = list(data.keys())
    values = list(data.values())
    cols = ", ".join([f'"{k}"' for k in keys])
    placeholders = ", ".join(["?"] * len(keys))
    try:
        cursor.execute(f"INSERT INTO cust ({cols}) VALUES ({placeholders})", values)
        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    return {"status": "success"}

@app.put("/api/cust/{kode}")
def update_customer(kode: str, data: dict = Body(...)):
    conn = get_db()
    cursor = conn.cursor()
    set_clause = ", ".join([f'"{k}" = ?' for k in data.keys()])
    values = list(data.values()) + [kode]
    try:
        cursor.execute(f"UPDATE cust SET {set_clause} WHERE KODE = ?", values)
        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    return {"status": "success"}

@app.delete("/api/cust/{kode}")
def delete_customer(kode: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cust WHERE KODE = ?", (kode,))
    conn.commit()
    conn.close()
    return {"status": "success"}

# --- SUPPLIER CRUD ---
@app.get("/api/supp")
def get_suppliers(q: str = Query(None), limit: int = 100, offset: int = 0):
    conn = get_db()
    cursor = conn.cursor()
    if q:
        query = "SELECT * FROM supp WHERE KODE LIKE ? OR NAMA LIKE ? LIMIT ? OFFSET ?"
        params = (f"%{q}%", f"%{q}%", limit, offset)
    else:
        query = "SELECT * FROM supp LIMIT ? OFFSET ?"
        params = (limit, offset)
    rows = [dict(row) for row in cursor.execute(query, params).fetchall()]
    conn.close()
    return rows

@app.post("/api/supp")
def add_supplier(data: dict = Body(...)):
    conn = get_db()
    cursor = conn.cursor()
    keys = list(data.keys())
    values = list(data.values())
    cols = ", ".join([f'"{k}"' for k in keys])
    placeholders = ", ".join(["?"] * len(keys))
    try:
        cursor.execute(f"INSERT INTO supp ({cols}) VALUES ({placeholders})", values)
        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    return {"status": "success"}

@app.put("/api/supp/{kode}")
def update_supplier(kode: str, data: dict = Body(...)):
    conn = get_db()
    cursor = conn.cursor()
    set_clause = ", ".join([f'"{k}" = ?' for k in data.keys()])
    values = list(data.values()) + [kode]
    try:
        cursor.execute(f"UPDATE supp SET {set_clause} WHERE KODE = ?", values)
        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        conn.close()
    return {"status": "success"}

@app.delete("/api/supp/{kode}")
def delete_supplier(kode: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM supp WHERE KODE = ?", (kode,))
    conn.commit()
    conn.close()
    return {"status": "success"}

# --- WEB DASHBOARD ---
@app.get("/", response_class=HTMLResponse)
def read_root():
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IS2000 Modernized Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen font-sans" x-data="appData()">
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <div class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div class="p-5 border-b border-gray-700">
                <h1 class="text-xl font-bold text-blue-400">IS2000 Modern</h1>
                <p class="text-xs text-gray-400">xBase Accounting & Inventory</p>
            </div>
            <nav class="flex-1 p-4 space-y-2">
                <button @click="tab = 'dashboard'" :class="tab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'" class="w-full text-left px-4 py-2 rounded-lg font-medium transition">Dashboard</button>
                <button @click="tab = 'stock'; loadStock()" :class="tab === 'stock' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'" class="w-full text-left px-4 py-2 rounded-lg font-medium transition">Inventory / Stock</button>
                <button @click="tab = 'cust'; loadCustomers()" :class="tab === 'cust' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'" class="w-full text-left px-4 py-2 rounded-lg font-medium transition">Customers</button>
                <button @click="tab = 'supp'; loadSuppliers()" :class="tab === 'supp' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'" class="w-full text-left px-4 py-2 rounded-lg font-medium transition">Suppliers</button>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-y-auto">
            <header class="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
                <h2 class="text-xl font-semibold capitalize" x-text="tab"></h2>
                <span class="text-xs bg-green-600 text-white px-2.5 py-1 rounded-full font-medium">Online (SQLite Bridge)</span>
            </header>

            <main class="p-6">
                <!-- Dashboard Tab -->
                <div x-show="tab === 'dashboard'" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
                            <p class="text-gray-400 text-sm">Total Products (Stock)</p>
                            <p class="text-3xl font-bold text-blue-400 mt-2" x-text="stats.stock || 0"></p>
                        </div>
                        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
                            <p class="text-gray-400 text-sm">Customers</p>
                            <p class="text-3xl font-bold text-green-400 mt-2" x-text="stats.customers || 0"></p>
                        </div>
                        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
                            <p class="text-gray-400 text-sm">Suppliers</p>
                            <p class="text-3xl font-bold text-purple-400 mt-2" x-text="stats.suppliers || 0"></p>
                        </div>
                    </div>
                </div>

                <!-- Stock Tab -->
                <div x-show="tab === 'stock'" class="space-y-4">
                    <div class="flex justify-between items-center">
                        <input type="text" x-model="searchStock" @input.debounce="loadStock()" placeholder="Search by Code or Name..." class="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg w-1/3 text-white">
                        <button @click="openStockModal()" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition">+ Add Item</button>
                    </div>
                    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-700 text-gray-300 text-xs uppercase">
                                    <th class="p-3">Code</th>
                                    <th class="p-3">Name</th>
                                    <th class="p-3">Unit</th>
                                    <th class="p-3">Price</th>
                                    <th class="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-700 text-sm">
                                <template x-for="item in stockList">
                                    <tr class="hover:bg-gray-750">
                                        <td class="p-3 font-mono text-blue-400" x-text="item.BARA"></td>
                                        <td class="p-3" x-text="item.NAMA"></td>
                                        <td class="p-3" x-text="item.SATUAN"></td>
                                        <td class="p-3" x-text="item.HJUAL"></td>
                                        <td class="p-3 space-x-2">
                                            <button @click="editStock(item)" class="text-yellow-400 hover:underline">Edit</button>
                                            <button @click="deleteStock(item.BARA)" class="text-red-400 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Customers Tab -->
                <div x-show="tab === 'cust'" class="space-y-4">
                    <div class="flex justify-between items-center">
                        <input type="text" x-model="searchCust" @input.debounce="loadCustomers()" placeholder="Search Customer..." class="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg w-1/3 text-white">
                        <button @click="openCustModal()" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition">+ Add Customer</button>
                    </div>
                    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-700 text-gray-300 text-xs uppercase">
                                    <th class="p-3">Code</th>
                                    <th class="p-3">Name</th>
                                    <th class="p-3">Address</th>
                                    <th class="p-3">Phone</th>
                                    <th class="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-700 text-sm">
                                <template x-for="item in custList">
                                    <tr class="hover:bg-gray-750">
                                        <td class="p-3 font-mono text-green-400" x-text="item.KODE"></td>
                                        <td class="p-3" x-text="item.NAMA"></td>
                                        <td class="p-3" x-text="item.ALAMAT"></td>
                                        <td class="p-3" x-text="item.TELP"></td>
                                        <td class="p-3 space-x-2">
                                            <button @click="editCust(item)" class="text-yellow-400 hover:underline">Edit</button>
                                            <button @click="deleteCust(item.KODE)" class="text-red-400 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Suppliers Tab -->
                <div x-show="tab === 'supp'" class="space-y-4">
                    <div class="flex justify-between items-center">
                        <input type="text" x-model="searchSupp" @input.debounce="loadSuppliers()" placeholder="Search Supplier..." class="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg w-1/3 text-white">
                        <button @click="openSuppModal()" class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition">+ Add Supplier</button>
                    </div>
                    <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-700 text-gray-300 text-xs uppercase">
                                    <th class="p-3">Code</th>
                                    <th class="p-3">Name</th>
                                    <th class="p-3">Address</th>
                                    <th class="p-3">Phone</th>
                                    <th class="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-700 text-sm">
                                <template x-for="item in suppList">
                                    <tr class="hover:bg-gray-750">
                                        <td class="p-3 font-mono text-purple-400" x-text="item.KODE"></td>
                                        <td class="p-3" x-text="item.NAMA"></td>
                                        <td class="p-3" x-text="item.ALAMAT"></td>
                                        <td class="p-3" x-text="item.TELP"></td>
                                        <td class="p-3 space-x-2">
                                            <button @click="editSupp(item)" class="text-yellow-400 hover:underline">Edit</button>
                                            <button @click="deleteSupp(item.KODE)" class="text-red-400 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <!-- Generic Modal -->
    <div x-show="modalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 class="text-lg font-bold" x-text="modalTitle"></h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                <template x-for="field in modalFields">
                    <div>
                        <label class="text-xs text-gray-400 uppercase" x-text="field"></label>
                        <input type="text" x-model="modalData[field]" :disabled="modalEditMode && field === modalKeyField" class="w-full bg-gray-900 border border-gray-700 px-3 py-2 rounded text-white mt-1 disabled:opacity-50">
                    </div>
                </template>
            </div>
            <div class="flex justify-end space-x-3 pt-2">
                <button @click="modalOpen = false" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">Cancel</button>
                <button @click="saveModal()" class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white">Save</button>
            </div>
        </div>
    </div>

    <script>
        function appData() {
            return {
                tab: 'dashboard',
                stats: {},
                stockList: [],
                custList: [],
                suppList: [],
                searchStock: '',
                searchCust: '',
                searchSupp: '',
                modalOpen: false,
                modalTitle: '',
                modalType: '',
                modalEditMode: false,
                modalKeyField: '',
                modalFields: [],
                modalData: {},
                init() {
                    fetch('/api/stats').then(res => res.json()).then(data => this.stats = data);
                },
                loadStock() {
                    fetch(`/api/stock?q=${encodeURIComponent(this.searchStock)}`).then(res => res.json()).then(data => this.stockList = data);
                },
                loadCustomers() {
                    fetch(`/api/cust?q=${encodeURIComponent(this.searchCust)}`).then(res => res.json()).then(data => this.custList = data);
                },
                loadSuppliers() {
                    fetch(`/api/supp?q=${encodeURIComponent(this.searchSupp)}`).then(res => res.json()).then(data => this.suppList = data);
                },
                openStockModal() {
                    this.modalType = 'stock';
                    this.modalTitle = 'Add Inventory Item';
                    this.modalEditMode = false;
                    this.modalKeyField = 'BARA';
                    this.modalFields = ['BARA', 'NAMA', 'SATUAN', 'HJUAL', 'HBELI'];
                    this.modalData = { BARA: '', NAMA: '', SATUAN: '', HJUAL: '0', HBELI: '0' };
                    this.modalOpen = true;
                },
                editStock(item) {
                    this.modalType = 'stock';
                    this.modalTitle = 'Edit Inventory Item';
                    this.modalEditMode = true;
                    this.modalKeyField = 'BARA';
                    this.modalFields = ['BARA', 'NAMA', 'SATUAN', 'HJUAL', 'HBELI'];
                    this.modalData = {...item};
                    this.modalOpen = true;
                },
                deleteStock(bara) {
                    if(confirm('Delete item ' + bara + '?')) {
                        fetch(`/api/stock/${bara}`, {method: 'DELETE'}).then(() => this.loadStock());
                    }
                },
                openCustModal() {
                    this.modalType = 'cust';
                    this.modalTitle = 'Add Customer';
                    this.modalEditMode = false;
                    this.modalKeyField = 'KODE';
                    this.modalFields = ['KODE', 'NAMA', 'ALAMAT', 'TELP'];
                    this.modalData = { KODE: '', NAMA: '', ALAMAT: '', TELP: '' };
                    this.modalOpen = true;
                },
                editCust(item) {
                    this.modalType = 'cust';
                    this.modalTitle = 'Edit Customer';
                    this.modalEditMode = true;
                    this.modalKeyField = 'KODE';
                    this.modalFields = ['KODE', 'NAMA', 'ALAMAT', 'TELP'];
                    this.modalData = {...item};
                    this.modalOpen = true;
                },
                deleteCust(kode) {
                    if(confirm('Delete customer ' + kode + '?')) {
                        fetch(`/api/cust/${kode}`, {method: 'DELETE'}).then(() => this.loadCustomers());
                    }
                },
                openSuppModal() {
                    this.modalType = 'supp';
                    this.modalTitle = 'Add Supplier';
                    this.modalEditMode = false;
                    this.modalKeyField = 'KODE';
                    this.modalFields = ['KODE', 'NAMA', 'ALAMAT', 'TELP'];
                    this.modalData = { KODE: '', NAMA: '', ALAMAT: '', TELP: '' };
                    this.modalOpen = true;
                },
                editSupp(item) {
                    this.modalType = 'supp';
                    this.modalTitle = 'Edit Supplier';
                    this.modalEditMode = true;
                    this.modalKeyField = 'KODE';
                    this.modalFields = ['KODE', 'NAMA', 'ALAMAT', 'TELP'];
                    this.modalData = {...item};
                    this.modalOpen = true;
                },
                deleteSupp(kode) {
                    if(confirm('Delete supplier ' + kode + '?')) {
                        fetch(`/api/supp/${kode}`, {method: 'DELETE'}).then(() => this.loadSuppliers());
                    }
                },
                saveModal() {
                    const url = this.modalEditMode
                        ? `/api/${this.modalType}/${this.modalData[this.modalKeyField]}`
                        : `/api/${this.modalType}`;
                    const method = this.modalEditMode ? 'PUT' : 'POST';

                    fetch(url, {
                        method: method,
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(this.modalData)
                    }).then(res => {
                        if(res.ok) {
                            this.modalOpen = false;
                            if(this.modalType === 'stock') this.loadStock();
                            if(this.modalType === 'cust') this.loadCustomers();
                            if(this.modalType === 'supp') this.loadSuppliers();
                        } else {
                            alert('Error saving record.');
                        }
                    });
                }
            }
        }
    </script>
</body>
</html>
    """
