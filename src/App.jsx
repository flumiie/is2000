import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ListFilter, Columns, Plus, Trash2, Edit2, LogOut } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("is2000_auth") === "true";
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [tab, setTab] = useState("dashboard");
  const [stock, setStock] = useState([]);
  const [cust, setCust] = useState([]);
  const [supp, setSupp] = useState([]);
  const [beli, setBeli] = useState([]);
  const [jual, setJual] = useState([]);

  const [filterStock, setFilterStock] = useState({
    BARA: "",
    NAMA: "",
    SATUAN: "",
    HJUAL: "",
  });
  const [filterCust, setFilterCust] = useState({
    KODE: "",
    NAMA: "",
    ALAMAT: "",
    TELP: "",
  });
  const [filterSupp, setFilterSupp] = useState({
    KODE: "",
    NAMA: "",
    ALAMAT: "",
    TELP: "",
  });
  const [filterBeli, setFilterBeli] = useState({});
  const [filterJual, setFilterJual] = useState({});

  const [tranSubTab, setTranSubTab] = useState("purchasing");

  const [pageStock, setPageStock] = useState(1);
  const [pageCust, setPageCust] = useState(1);
  const [pageSupp, setPageSupp] = useState(1);
  const [pageBeli, setPageBeli] = useState(1);
  const [pageJual, setPageJual] = useState(1);
  const pageSize = 50;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("stock");
  const [modalEdit, setModalEdit] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/data/stock.json")
        .then((res) => res.json())
        .then(setStock)
        .catch(() => {});
      fetch("/data/cust.json")
        .then((res) => res.json())
        .then(setCust)
        .catch(() => {});
      fetch("/data/supp.json")
        .then((res) => res.json())
        .then(setSupp)
        .catch(() => {});
      fetch("/data/beli.json")
        .then((res) => res.json())
        .then(setBeli)
        .catch(() => {});
      fetch("/data/jual.json")
        .then((res) => res.json())
        .then(setJual)
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.toUpperCase() === "LI" && password === "AMA") {
      localStorage.setItem("is2000_auth", "true");
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("is2000_auth");
    setIsAuthenticated(false);
  };

  const filteredStock = stock.filter((item) =>
    Object.entries(filterStock).every(
      ([key, val]) =>
        !val ||
        (item[key] &&
          String(item[key]).toLowerCase().includes(val.toLowerCase())),
    ),
  );

  const filteredCust = cust.filter((item) =>
    Object.entries(filterCust).every(
      ([key, val]) =>
        !val ||
        (item[key] &&
          String(item[key]).toLowerCase().includes(val.toLowerCase())),
    ),
  );

  const filteredSupp = supp.filter((item) =>
    Object.entries(filterSupp).every(
      ([key, val]) =>
        !val ||
        (item[key] &&
          String(item[key]).toLowerCase().includes(val.toLowerCase())),
    ),
  );

  const filteredBeli = beli.filter((item) =>
    Object.entries(filterBeli).every(
      ([key, val]) =>
        !val ||
        (item[key] !== undefined &&
          item[key] !== null &&
          String(item[key]).toLowerCase().includes(val.toLowerCase())),
    ),
  );

  const filteredJual = jual.filter((item) =>
    Object.entries(filterJual).every(
      ([key, val]) =>
        !val ||
        (item[key] !== undefined &&
          item[key] !== null &&
          String(item[key]).toLowerCase().includes(val.toLowerCase())),
    ),
  );

  const totalPagesStock = Math.ceil(filteredStock.length / pageSize) || 1;
  const paginatedStock = filteredStock.slice(
    (pageStock - 1) * pageSize,
    pageStock * pageSize,
  );

  const totalPagesCust = Math.ceil(filteredCust.length / pageSize) || 1;
  const paginatedCust = filteredCust.slice(
    (pageCust - 1) * pageSize,
    pageCust * pageSize,
  );

  const totalPagesSupp = Math.ceil(filteredSupp.length / pageSize) || 1;
  const paginatedSupp = filteredSupp.slice(
    (pageSupp - 1) * pageSize,
    pageSupp * pageSize,
  );

  const totalPagesBeli = Math.ceil(filteredBeli.length / pageSize) || 1;
  const paginatedBeli = filteredBeli.slice(
    (pageBeli - 1) * pageSize,
    pageBeli * pageSize,
  );

  const totalPagesJual = Math.ceil(filteredJual.length / pageSize) || 1;
  const paginatedJual = filteredJual.slice(
    (pageJual - 1) * pageSize,
    pageJual * pageSize,
  );

  const renderPagination = (page, setPage, totalPages) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return (
      <div className="flex flex-wrap justify-between items-center py-2 text-sm text-gray-400 px-2 gap-2">
        <span>
          Halaman {page} dari {totalPages}
        </span>
        <div className="flex items-center space-x-1 overflow-x-auto max-w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="h-8 px-2.5 text-xs bg-gray-800 border-gray-700 text-white"
          >
            &laquo;
          </Button>
          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={idx} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <Button
                key={idx}
                variant={page === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className={`h-8 px-2.5 text-xs ${
                  page === p
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-gray-800 border-gray-700 text-gray-200"
                }`}
              >
                {p}
              </Button>
            ),
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="h-8 px-2.5 text-xs bg-gray-800 border-gray-700 text-white"
          >
            &raquo;
          </Button>
        </div>
      </div>
    );
  };

  const handleOpenAdd = (type) => {
    setModalType(type);
    setModalEdit(false);
    if (type === "stock")
      setFormData({ BARA: "", NAMA: "", SATUAN: "", HJUAL: "0", HBELI: "0" });
    else if (type === "cust" || type === "supp")
      setFormData({ KODE: "", NAMA: "", ALAMAT: "", TELP: "" });
    else if (type === "beli") {
      const template =
        beli.length > 0
          ? Object.keys(beli[0]).reduce((acc, k) => ({ ...acc, [k]: "" }), {})
          : { NOTA: "", TGL: "", KODE: "", TOTAL: "" };
      setFormData(template);
    } else if (type === "jual") {
      const template =
        jual.length > 0
          ? Object.keys(jual[0]).reduce((acc, k) => ({ ...acc, [k]: "" }), {})
          : { NOTA: "", TGL: "", KODE: "", TOTAL: "" };
      setFormData(template);
    }
    setModalOpen(true);
  };

  const handleOpenEdit = (type, item, index) => {
    setModalType(type);
    setModalEdit(true);
    setFormData({ ...item, __index: index });
    setModalOpen(true);
  };

  const handleDelete = (type, keyVal, index) => {
    if (!confirm(`Hapus data ini?`)) return;
    if (type === "stock") setStock(stock.filter((i) => i.BARA !== keyVal));
    if (type === "cust") setCust(cust.filter((i) => i.KODE !== keyVal));
    if (type === "supp") setSupp(supp.filter((i) => i.KODE !== keyVal));
    if (type === "beli") setBeli(beli.filter((_, idx) => idx !== index));
    if (type === "jual") setJual(jual.filter((_, idx) => idx !== index));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalType === "stock") {
      const key = formData.BARA;
      if (modalEdit) {
        setStock(stock.map((i) => (i.BARA === key ? formData : i)));
      } else {
        setStock([formData, ...stock]);
      }
    } else if (modalType === "cust") {
      const key = formData.KODE;
      if (modalEdit) {
        setCust(cust.map((i) => (i.KODE === key ? formData : i)));
      } else {
        setCust([formData, ...cust]);
      }
    } else if (modalType === "supp") {
      const key = formData.KODE;
      if (modalEdit) {
        setSupp(supp.map((i) => (i.KODE === key ? formData : i)));
      } else {
        setSupp([formData, ...supp]);
      }
    } else if (modalType === "beli") {
      const cleanData = { ...formData };
      delete cleanData.__index;
      if (modalEdit) {
        const idx = formData.__index;
        setBeli(beli.map((i, iIdx) => (iIdx === idx ? cleanData : i)));
      } else {
        setBeli([cleanData, ...beli]);
      }
    } else if (modalType === "jual") {
      const cleanData = { ...formData };
      delete cleanData.__index;
      if (modalEdit) {
        const idx = formData.__index;
        setJual(jual.map((i, iIdx) => (iIdx === idx ? cleanData : i)));
      } else {
        setJual([cleanData, ...jual]);
      }
    }
    setModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-400">Masuk</h1>
            <p className="text-xs text-gray-400 mt-1">
              Masukkan kredensial untuk mengakses sistem
            </p>
          </div>
          {loginError && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 text-xs p-3 rounded">
              Nama pengguna atau kata sandi salah
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase">
                Nama Pengguna
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                className="w-full bg-gray-900 border-gray-700 text-white mt-1 uppercase"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase">
                Kata Sandi
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value.toUpperCase())}
                className="w-full bg-gray-900 border-gray-700 text-white mt-1"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-medium transition text-white"
          >
            Masuk
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">IS2000</h1>
          <p className="text-xs text-gray-400">Client xBase</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={tab === "dashboard" ? "default" : "ghost"}
            onClick={() => setTab("dashboard")}
            className={`w-full justify-start font-medium transition ${tab === "dashboard" ? "bg-blue-600 text-white hover:bg-blue-600" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
          >
            Dasbor
          </Button>
          <Button
            variant={tab === "stock" ? "default" : "ghost"}
            onClick={() => setTab("stock")}
            className={`w-full justify-start font-medium transition ${tab === "stock" ? "bg-blue-600 text-white hover:bg-blue-600" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
          >
            Stock
          </Button>
          <Button
            variant={tab === "cust" ? "default" : "ghost"}
            onClick={() => setTab("cust")}
            className={`w-full justify-start font-medium transition ${tab === "cust" ? "bg-blue-600 text-white hover:bg-blue-600" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
          >
            Pelanggan
          </Button>
          <Button
            variant={tab === "transactions" ? "default" : "ghost"}
            onClick={() => setTab("transactions")}
            className={`w-full justify-start font-medium transition ${tab === "transactions" ? "bg-blue-600 text-white hover:bg-blue-600" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
          >
            Transaksi
          </Button>
          <Button
            variant={tab === "supp" ? "default" : "ghost"}
            onClick={() => setTab("supp")}
            className={`w-full justify-start font-medium transition ${tab === "supp" ? "bg-blue-600 text-white hover:bg-blue-600" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
          >
            Supplier
          </Button>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full bg-red-600/80 hover:bg-red-600 text-white py-2 rounded font-medium transition text-sm"
          >
            Keluar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold capitalize">
            {tab === "dashboard"
              ? "Dasbor"
              : tab === "stock"
                ? "Inventaris / Stok"
                : tab === "cust"
                  ? "Pelanggan"
                  : tab === "transactions"
                    ? "Transaksi"
                    : "Pemasok"}
          </h2>
          <Badge className="bg-purple-600 text-white px-2.5 py-1 font-medium">
            Vite + React SPA
          </Badge>
        </header>

        <main className="p-6">
          {tab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
                <p className="text-gray-400 text-sm">Total Produk</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {stock.length}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
                <p className="text-gray-400 text-sm">Pelanggan</p>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  {cust.length}
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
                <p className="text-gray-400 text-sm">Pemasok</p>
                <p className="text-3xl font-bold text-purple-400 mt-2">
                  {supp.length}
                </p>
              </div>
            </div>
          )}

          {tab === "stock" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-300">
                    Filter Kolom:
                  </span>
                  <Input
                    type="text"
                    placeholder="Kode (BARA)"
                    value={filterStock.BARA}
                    onChange={(e) => {
                      setFilterStock({ ...filterStock, BARA: e.target.value });
                      setPageStock(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-32"
                  />
                  <Input
                    type="text"
                    placeholder="Nama"
                    value={filterStock.NAMA}
                    onChange={(e) => {
                      setFilterStock({ ...filterStock, NAMA: e.target.value });
                      setPageStock(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-40"
                  />
                  <Input
                    type="text"
                    placeholder="Harga"
                    value={filterStock.HJUAL}
                    onChange={(e) => {
                      setFilterStock({ ...filterStock, HJUAL: e.target.value });
                      setPageStock(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-24"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterStock({
                        BARA: "",
                        NAMA: "",
                        SATUAN: "",
                        HJUAL: "",
                      });
                      setPageStock(1);
                    }}
                    className="text-xs bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200"
                  >
                    Reset
                  </Button>
                </div>
                <Button
                  onClick={() => handleOpenAdd("stock")}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Tambah Item
                </Button>
              </div>
              {renderPagination(pageStock, setPageStock, totalPagesStock)}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-700 text-gray-300 text-xs uppercase border-b border-gray-700 hover:bg-gray-700">
                      <TableHead className="text-gray-300">Kode</TableHead>
                      <TableHead className="text-gray-300">Nama</TableHead>
                      <TableHead className="text-gray-300">Satuan</TableHead>
                      <TableHead className="text-gray-300">Harga</TableHead>
                      <TableHead className="text-gray-300">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-700 text-sm">
                    {paginatedStock.map((item, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-gray-750 border-b border-gray-700"
                      >
                        <TableCell className="font-mono text-blue-400">
                          {item.BARA}
                        </TableCell>
                        <TableCell>{item.NAMA}</TableCell>
                        <TableCell>{item.SATUAN}</TableCell>
                        <TableCell>{item.HJUAL}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit("stock", item)}
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-transparent h-auto p-0 font-normal underline"
                          >
                            Ubah
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("stock", item.BARA)}
                            className="text-red-400 hover:text-red-300 hover:bg-transparent h-auto p-0 font-normal underline"
                          >
                            Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {renderPagination(pageStock, setPageStock, totalPagesStock)}
            </div>
          )}

          {tab === "cust" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-300">
                    Filter Kolom:
                  </span>
                  <Input
                    type="text"
                    placeholder="Kode"
                    value={filterCust.KODE}
                    onChange={(e) => {
                      setFilterCust({ ...filterCust, KODE: e.target.value });
                      setPageCust(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-28"
                  />
                  <Input
                    type="text"
                    placeholder="Nama"
                    value={filterCust.NAMA}
                    onChange={(e) => {
                      setFilterCust({ ...filterCust, NAMA: e.target.value });
                      setPageCust(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-36"
                  />
                  <Input
                    type="text"
                    placeholder="Alamat"
                    value={filterCust.ALAMAT}
                    onChange={(e) => {
                      setFilterCust({ ...filterCust, ALAMAT: e.target.value });
                      setPageCust(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-36"
                  />
                  <Input
                    type="text"
                    placeholder="Telepon"
                    value={filterCust.TELP}
                    onChange={(e) => {
                      setFilterCust({ ...filterCust, TELP: e.target.value });
                      setPageCust(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-28"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterCust({
                        KODE: "",
                        NAMA: "",
                        ALAMAT: "",
                        TELP: "",
                      });
                      setPageCust(1);
                    }}
                    className="text-xs bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200"
                  >
                    Reset
                  </Button>
                </div>
                <Button
                  onClick={() => handleOpenAdd("cust")}
                  className="bg-green-600 hover:bg-green-500 text-white font-medium text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Tambah Pelanggan
                </Button>
              </div>
              {renderPagination(pageCust, setPageCust, totalPagesCust)}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-700 text-gray-300 text-xs uppercase border-b border-gray-700 hover:bg-gray-700">
                      <TableHead className="text-gray-300">Kode</TableHead>
                      <TableHead className="text-gray-300">Nama</TableHead>
                      <TableHead className="text-gray-300">Alamat</TableHead>
                      <TableHead className="text-gray-300">Telepon</TableHead>
                      <TableHead className="text-gray-300">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-700 text-sm">
                    {paginatedCust.map((item, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-gray-750 border-b border-gray-700"
                      >
                        <TableCell className="font-mono text-green-400">
                          {item.KODE}
                        </TableCell>
                        <TableCell>{item.NAMA}</TableCell>
                        <TableCell>{item.ALAMAT}</TableCell>
                        <TableCell>{item.TELP}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit("cust", item)}
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-transparent h-auto p-0 font-normal underline"
                          >
                            Ubah
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("cust", item.KODE)}
                            className="text-red-400 hover:text-red-300 hover:bg-transparent h-auto p-0 font-normal underline"
                          >
                            Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {renderPagination(pageCust, setPageCust, totalPagesCust)}
            </div>
          )}

          {tab === "supp" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-300">
                    Filter Kolom:
                  </span>
                  <Input
                    type="text"
                    placeholder="Kode"
                    value={filterSupp.KODE}
                    onChange={(e) => {
                      setFilterSupp({ ...filterSupp, KODE: e.target.value });
                      setPageSupp(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-28"
                  />
                  <Input
                    type="text"
                    placeholder="Nama"
                    value={filterSupp.NAMA}
                    onChange={(e) => {
                      setFilterSupp({ ...filterSupp, NAMA: e.target.value });
                      setPageSupp(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-36"
                  />
                  <Input
                    type="text"
                    placeholder="Alamat"
                    value={filterSupp.ALAMAT}
                    onChange={(e) => {
                      setFilterSupp({ ...filterSupp, ALAMAT: e.target.value });
                      setPageSupp(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-36"
                  />
                  <Input
                    type="text"
                    placeholder="Telepon"
                    value={filterSupp.TELP}
                    onChange={(e) => {
                      setFilterSupp({ ...filterSupp, TELP: e.target.value });
                      setPageSupp(1);
                    }}
                    className="bg-gray-900 border-gray-700 text-xs text-white w-28"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterSupp({
                        KODE: "",
                        NAMA: "",
                        ALAMAT: "",
                        TELP: "",
                      });
                      setPageSupp(1);
                    }}
                    className="text-xs bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200"
                  >
                    Reset
                  </Button>
                </div>
                <Button
                  onClick={() => handleOpenAdd("supp")}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Tambah Pemasok
                </Button>
              </div>
              {renderPagination(pageSupp, setPageSupp, totalPagesSupp)}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-700 text-gray-300 text-xs uppercase border-b border-gray-700 hover:bg-gray-700">
                      <TableHead className="text-gray-300">Kode</TableHead>
                      <TableHead className="text-gray-300">Nama</TableHead>
                      <TableHead className="text-gray-300">Alamat</TableHead>
                      <TableHead className="text-gray-300">Telepon</TableHead>
                      <TableHead className="text-gray-300">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-700 text-sm">
                    {paginatedSupp.map((item, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-gray-750 border-b border-gray-700"
                      >
                        <TableCell className="font-mono text-purple-400">
                          {item.KODE}
                        </TableCell>
                        <TableCell>{item.NAMA}</TableCell>
                        <TableCell>{item.ALAMAT}</TableCell>
                        <TableCell>{item.TELP}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit("supp", item)}
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-transparent h-auto p-0 font-normal underline"
                          >
                            Ubah
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete("supp", item.KODE)}
                            className="text-red-400 hover:text-red-300 hover:bg-transparent h-auto p-0 font-normal underline"
                          >
                            Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {renderPagination(pageSupp, setPageSupp, totalPagesSupp)}
            </div>
          )}

          {tab === "transactions" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                <div className="flex space-x-2">
                  <Button
                    variant={
                      tranSubTab === "purchasing" ? "default" : "outline"
                    }
                    onClick={() => setTranSubTab("purchasing")}
                    className={`font-medium transition ${tranSubTab === "purchasing" ? "bg-blue-600 text-white hover:bg-blue-600" : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  >
                    Pembelian
                  </Button>
                  <Button
                    variant={tranSubTab === "selling" ? "default" : "outline"}
                    onClick={() => setTranSubTab("selling")}
                    className={`font-medium transition ${tranSubTab === "selling" ? "bg-blue-600 text-white hover:bg-blue-600" : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  >
                    Penjualan
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    handleOpenAdd(tranSubTab === "purchasing" ? "beli" : "jual")
                  }
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {tranSubTab === "purchasing"
                    ? "Tambah Pembelian"
                    : "Tambah Penjualan"}
                </Button>
              </div>

              {tranSubTab === "purchasing" && (
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300">
                        Filter Kolom:
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFilterBeli({});
                          setPageBeli(1);
                        }}
                        className="text-xs bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300"
                      >
                        Reset Semua Filter
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {beli.length > 0 &&
                        Object.keys(beli[0])
                          .filter(
                            (k) => !["PPH", "DISC"].includes(k.toUpperCase()),
                          )
                          .slice(0, 6)
                          .map((key) => (
                            <Input
                              key={key}
                              type="text"
                              placeholder={`Filter ${key}...`}
                              value={filterBeli[key] || ""}
                              onChange={(e) => {
                                setFilterBeli({
                                  ...filterBeli,
                                  [key]: e.target.value,
                                });
                                setPageBeli(1);
                              }}
                              className="bg-gray-900 border-gray-700 text-xs text-white"
                            />
                          ))}
                    </div>
                  </div>
                  {renderPagination(pageBeli, setPageBeli, totalPagesBeli)}
                  <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto shadow">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-700 text-gray-300 text-xs uppercase border-b border-gray-700 hover:bg-gray-700">
                          {beli.length > 0 &&
                            Object.keys(beli[0])
                              .slice(0, 6)
                              .map((key, i) => (
                                <TableHead key={i} className="text-gray-300">
                                  {key}
                                </TableHead>
                              ))}
                          <TableHead className="text-gray-300">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-700 text-sm">
                        {paginatedBeli.map((item, idx) => (
                          <TableRow
                            key={idx}
                            className="hover:bg-gray-750 border-b border-gray-700"
                          >
                            {Object.values(item)
                              .slice(0, 6)
                              .map((val, i) => (
                                <TableCell key={i}>
                                  {String(val ?? "")}
                                </TableCell>
                              ))}
                            <TableCell className="space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleOpenEdit("beli", item, idx)
                                }
                                className="text-yellow-400 hover:text-yellow-300 hover:bg-transparent h-auto p-0 font-normal underline"
                              >
                                Ubah
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete("beli", null, idx)}
                                className="text-red-400 hover:text-red-300 hover:bg-transparent h-auto p-0 font-normal underline"
                              >
                                Hapus
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {renderPagination(pageBeli, setPageBeli, totalPagesBeli)}
                </div>
              )}

              {tranSubTab === "selling" && (
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300">
                        Filter Kolom:
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFilterJual({});
                          setPageJual(1);
                        }}
                        className="text-xs bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300"
                      >
                        Reset Semua Filter
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {jual.length > 0 &&
                        Object.keys(jual[0])
                          .filter(
                            (k) => !["PPH", "DISC"].includes(k.toUpperCase()),
                          )
                          .slice(0, 6)
                          .map((key) => (
                            <Input
                              key={key}
                              type="text"
                              placeholder={`Filter ${key}...`}
                              value={filterJual[key] || ""}
                              onChange={(e) => {
                                setFilterJual({
                                  ...filterJual,
                                  [key]: e.target.value,
                                });
                                setPageJual(1);
                              }}
                              className="bg-gray-900 border-gray-700 text-xs text-white"
                            />
                          ))}
                    </div>
                  </div>
                  {renderPagination(pageJual, setPageJual, totalPagesJual)}
                  <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto shadow">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-700 text-gray-300 text-xs uppercase border-b border-gray-700 hover:bg-gray-700">
                          {jual.length > 0 &&
                            Object.keys(jual[0])
                              .slice(0, 6)
                              .map((key, i) => (
                                <TableHead key={i} className="text-gray-300">
                                  {key}
                                </TableHead>
                              ))}
                          <TableHead className="text-gray-300">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-700 text-sm">
                        {paginatedJual.map((item, idx) => (
                          <TableRow
                            key={idx}
                            className="hover:bg-gray-750 border-b border-gray-700"
                          >
                            {Object.values(item)
                              .slice(0, 6)
                              .map((val, i) => (
                                <TableCell key={i}>
                                  {String(val ?? "")}
                                </TableCell>
                              ))}
                            <TableCell className="space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleOpenEdit("jual", item, idx)
                                }
                                className="text-yellow-400 hover:text-yellow-300 hover:bg-transparent h-auto p-0 font-normal underline"
                              >
                                Ubah
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete("jual", null, idx)}
                                className="text-red-400 hover:text-red-300 hover:bg-transparent h-auto p-0 font-normal underline"
                              >
                                Hapus
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {renderPagination(pageJual, setPageJual, totalPagesJual)}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">
              {modalEdit ? "Ubah" : "Tambah"}{" "}
              {modalType === "stock"
                ? "Item Inventaris"
                : modalType === "cust"
                  ? "Pelanggan"
                  : modalType === "supp"
                    ? "Pemasok"
                    : modalType === "beli"
                      ? "Transaksi Pembelian"
                      : "Transaksi Penjualan"}
            </h3>
            <form
              onSubmit={handleSave}
              className="space-y-3 max-h-96 overflow-y-auto"
            >
              {modalType === "stock" ? (
                <>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Kode (BARA)
                    </label>
                    <Input
                      type="text"
                      disabled={modalEdit}
                      value={formData.BARA || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, BARA: e.target.value })
                      }
                      className="w-full bg-gray-900 border-gray-700 text-white mt-1 disabled:opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Nama
                    </label>
                    <Input
                      type="text"
                      value={formData.NAMA || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, NAMA: e.target.value })
                      }
                      className="w-full bg-gray-900 border-gray-700 text-white mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Satuan
                    </label>
                    <Input
                      type="text"
                      value={formData.SATUAN || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, SATUAN: e.target.value })
                      }
                      className="w-full bg-gray-900 border-gray-700 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Harga Jual
                    </label>
                    <Input
                      type="text"
                      value={formData.HJUAL || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, HJUAL: e.target.value })
                      }
                      className="w-full bg-gray-900 border-gray-700 text-white mt-1"
                    />
                  </div>
                </>
              ) : modalType === "cust" || modalType === "supp" ? (
                <>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Kode
                    </label>
                    <Input
                      type="text"
                      disabled={modalEdit}
                      value={formData.KODE || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, KODE: e.target.value })
                      }
                      className="w-full bg-gray-900 border-gray-700 text-white mt-1 disabled:opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Nama
                    </label>
                    <Input
                      type="text"
                      value={formData.NAMA || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, NAMA: e.target.value })
                      }
                      className="w-full bg-gray-900 border-gray-700 text-white mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Alamat
                    </label>
                    <Input
                      type="text"
                      value={formData.ALAMAT || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, ALAMAT: e.target.value })
                      }
                      className="w-full bg-gray-900 border-gray-700 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">
                      Telepon
                    </label>
                    <Input
                      type="text"
                      value={formData.TELP || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, TELP: e.target.value })
                      }
                      className="w-full bg-gray-900 border-gray-700 text-white mt-1"
                    />
                  </div>
                </>
              ) : (
                <>
                  {Object.keys(formData)
                    .filter((k) => k !== "__index")
                    .map((key) => (
                      <div key={key}>
                        <label className="text-xs text-gray-400 uppercase">
                          {key}
                        </label>
                        <Input
                          type="text"
                          value={formData[key] || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, [key]: e.target.value })
                          }
                          className="w-full bg-gray-900 border-gray-700 text-white mt-1"
                        />
                      </div>
                    ))}
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
