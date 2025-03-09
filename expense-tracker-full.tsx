import React, { useState, useEffect } from 'react';
import { 
  Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, Receipt, 
  ChevronRight, Plus, User, Search, Bell, Home, PieChart, 
  FileText, Calendar, Settings, LogOut, Menu, X, Filter, 
  Download, Camera, CreditCard, CheckCircle, Upload, ChevronDown,
  Share, DollarSign, FileSpreadsheet, UserCircle, Briefcase, Tag,
  AlertCircle, BarChart2, TrendingUp, CircleDollarSign, Image, 
  Trash2, ClipboardEdit, Calculator, CalendarRange, Building, 
  Send, CheckSquare, Info, Save, ExternalLink
} from 'lucide-react';

const ExpenseTrackerFull = () => {
  // Estado principal del sistema
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Estados de autenticación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para modales y funcionalidades
  const [showScanModal, setShowScanModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeExpense, setActiveExpense] = useState(null);
  const [scanStep, setScanStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('thisMonth');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCostCenters, setSelectedCostCenters] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [exportFormat, setExportFormat] = useState('excel');
  const [showScanSuccess, setShowScanSuccess] = useState(false);
  
  // Estado para el nuevo gasto
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    costCenter: '',
    description: '',
    taxAmount: '',
    taxRate: '21',
    supplierNIF: '',
    invoiceNumber: '',
    receiptImage: null
  });
  
  // Datos de ejemplo - categorías
  const categories = [
    { id: 1, name: 'Transporte', icon: 'car' },
    { id: 2, name: 'Alojamiento', icon: 'building' },
    { id: 3, name: 'Comidas', icon: 'coffee' },
    { id: 4, name: 'Material oficina', icon: 'printer' },
    { id: 5, name: 'Servicios', icon: 'globe' },
    { id: 6, name: 'Representación', icon: 'users' },
    { id: 7, name: 'Formación', icon: 'book' },
    { id: 8, name: 'Software', icon: 'code' }
  ];
  
  // Datos de ejemplo - centros de costo
  const costCenters = [
    { id: 1, name: 'Marketing', code: 'MKT-01', entity: 'Grupo Innovación SL' },
    { id: 2, name: 'Ventas', code: 'VNT-01', entity: 'Grupo Innovación SL' },
    { id: 3, name: 'IT', code: 'IT-01', entity: 'Grupo Innovación SL' },
    { id: 4, name: 'Recursos Humanos', code: 'RRHH-01', entity: 'Grupo Innovación SL' },
    { id: 5, name: 'Administración', code: 'ADM-01', entity: 'Grupo Innovación SL' },
    { id: 6, name: 'Innovación', code: 'INV-01', entity: 'Grupo Tecnología SA' }
  ];
  
  // Datos de ejemplo - usuarios
  const users = [
    { id: 1, name: 'Carlos Méndez', email: 'carlos.mendez@grupoempresarial.com', role: 'Gerente Marketing', avatar: null },
    { id: 2, name: 'Ana Rodríguez', email: 'ana.rodriguez@grupoempresarial.com', role: 'Directora Comercial', avatar: null },
    { id: 3, name: 'Jorge Sánchez', email: 'jorge.sanchez@grupoempresarial.com', role: 'Técnico IT', avatar: null }
  ];
  
  // Datos de ejemplo - gastos
  const [expenses, setExpenses] = useState([
    { 
      id: 1, 
      title: 'Taxi aeropuerto', 
      date: '2025-03-08', 
      category: 'Transporte',
      categoryId: 1,
      costCenter: 'Marketing',
      costCenterId: 1,
      amount: 350, 
      status: 'Procesando',
      description: 'Traslado del aeropuerto de Barcelona al hotel',
      user: 'Carlos Méndez',
      userId: 1,
      invoiceNumber: 'T-2025-1234',
      taxAmount: 60.52,
      taxRate: 21,
      createdAt: '2025-03-08T13:45:00'
    },
    { 
      id: 2, 
      title: 'Hotel Continental', 
      date: '2025-03-07', 
      category: 'Alojamiento',
      categoryId: 2,
      costCenter: 'Ventas',
      costCenterId: 2,
      amount: 1250, 
      status: 'Aprobado',
      description: 'Estancia de 2 noches para feria de tecnología',
      user: 'Ana Rodríguez',
      userId: 2,
      invoiceNumber: 'H-2025-4587',
      taxAmount: 216.95,
      taxRate: 21,
      createdAt: '2025-03-07T10:15:00'
    },
    { 
      id: 3, 
      title: 'Oficina Central', 
      date: '2025-02-20', 
      category: 'Material oficina',
      categoryId: 4,
      costCenter: 'Administración',
      costCenterId: 5,
      amount: 89.90, 
      status: 'Aprobado',
      description: 'Compra de material de oficina para departamento',
      user: 'Carlos Méndez',
      userId: 1,
      invoiceNumber: 'F-2025-387',
      taxAmount: 15.60,
      taxRate: 21,
      createdAt: '2025-02-20T16:30:00'
    },
    { 
      id: 4, 
      title: 'Restaurante El Dorado', 
      date: '2025-03-08', 
      category: 'Comidas',
      categoryId: 3,
      costCenter: 'Marketing',
      costCenterId: 1,
      amount: 145.80, 
      status: 'Pendiente',
      description: 'Comida con cliente potencial para nuevo proyecto',
      user: 'Carlos Méndez',
      userId: 1,
      invoiceNumber: 'F-2025-0134',
      taxAmount: 25.33,
      taxRate: 21,
      createdAt: '2025-03-08T14:45:00'
    },
    { 
      id: 5, 
      title: 'Software de análisis', 
      date: '2025-03-05', 
      category: 'Software',
      categoryId: 8,
      costCenter: 'IT',
      costCenterId: 3,
      amount: 790.50, 
      status: 'Rechazado',
      description: 'Suscripción anual de herramienta de análisis de datos',
      user: 'Jorge Sánchez',
      userId: 3,
      invoiceNumber: 'INV-2025-75843',
      taxAmount: 137.22,
      taxRate: 21,
      createdAt: '2025-03-05T09:10:00'
    },
    { 
      id: 6, 
      title: 'Cursos especialización', 
      date: '2025-02-15', 
      category: 'Formación',
      categoryId: 7,
      costCenter: 'Recursos Humanos',
      costCenterId: 4,
      amount: 450, 
      status: 'Aprobado',
      description: 'Curso especialización marketing digital',
      user: 'Carlos Méndez',
      userId: 1,
      invoiceNumber: 'FORM-2025-123',
      taxAmount: 78.10,
      taxRate: 21,
      createdAt: '2025-02-15T11:30:00'
    }
  ]);
  
  // Filtrando gastos basados en los criterios
  const filteredExpenses = expenses.filter(expense => {
    // Filtro por término de búsqueda
    const matchesSearch = !searchTerm || 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categorías seleccionadas
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(expense.categoryId);
    
    // Filtro por centro de costos
    const matchesCostCenter = selectedCostCenters.length === 0 || 
      selectedCostCenters.includes(expense.costCenterId);
    
    // Filtro por estado
    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.includes(expense.status);
    
    // Filtro por fecha
    let matchesDate = true;
    const expenseDate = new Date(expense.date);
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    if (selectedDateRange === 'today') {
      matchesDate = expenseDate.toDateString() === today.toDateString();
    } else if (selectedDateRange === 'thisMonth') {
      matchesDate = expenseDate >= firstDayOfMonth && expenseDate <= lastDayOfMonth;
    } else if (selectedDateRange === 'lastMonth') {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      matchesDate = expenseDate >= firstDayLastMonth && expenseDate <= lastDayLastMonth;
    }
    
    return matchesSearch && matchesCategory && matchesCostCenter && matchesStatus && matchesDate;
  });
  
  // Datos para gráfico de distribución por categoría
  const expensesByCategory = categories.map(category => {
    const total = expenses
      .filter(expense => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      id: category.id,
      name: category.name,
      value: total
    };
  }).sort((a, b) => b.value - a.value); // Ordenar de mayor a menor
  
  // Datos para gráfico por centro de costos
  const expensesByCostCenter = costCenters.map(costCenter => {
    const total = expenses
      .filter(expense => expense.costCenterId === costCenter.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      id: costCenter.id,
      name: costCenter.name,
      value: total
    };
  }).sort((a, b) => b.value - a.value); // Ordenar de mayor a menor
  
  // Datos para tendencia mensual - últimos 6 meses
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleString('es', { month: 'short' });
    const year = date.getFullYear();
    const monthNumber = date.getMonth();
    
    // Filtrar gastos de este mes
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === monthNumber && expenseDate.getFullYear() === year;
    });
    
    // Calcular total
    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      month: monthName,
      amount: total,
      expenses: monthlyExpenses.length
    };
  }).reverse(); // Ordenar de más antiguo a más reciente
  
  // Informes disponibles
  const availableReports = [
    { 
      id: 1, 
      title: 'Gastos por categoría', 
      description: 'Desglose de gastos por categoría',
      type: 'category',
      lastUpdated: 'Hoy',
      period: 'Último mes',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      id: 2, 
      title: 'Resumen por centro de costos', 
      description: 'Análisis de gastos por centro de costos',
      type: 'costCenter',
      lastUpdated: 'Ayer',
      period: 'Q1 2025',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    { 
      id: 3, 
      title: 'Análisis trimestral', 
      description: 'Comparativa de gastos del trimestre',
      type: 'quarterly',
      lastUpdated: '20/12/2024',
      period: 'Q4 2024',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];
  
  // Efecto para el splash screen
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 1800);
      
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);
  
  // Función para manejar el login
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de login
    setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('app');
    }, 1000);
  };
  
  // Función para cerrar sesión
  const handleLogout = () => {
    setCurrentScreen('login');
    setEmail('');
    setPassword('');
  };
  
  // Función para abrir modal de detalle
  const handleViewExpense = (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId);
    setActiveExpense(expense);
    setShowDetailModal(true);
  };
  
  // Función para crear un nuevo gasto
  const handleCreateExpense = () => {
    setShowNewExpenseModal(false);
    
    // Generar ID para el nuevo gasto
    const newId = Math.max(...expenses.map(e => e.id)) + 1;
    
    // Crear objeto de nuevo gasto
    const expenseToAdd = {
      ...newExpense,
      id: newId,
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
      user: 'Carlos Méndez',
      userId: 1,
      amount: parseFloat(newExpense.amount),
      taxAmount: parseFloat(newExpense.taxAmount),
      taxRate: parseFloat(newExpense.taxRate),
      // Convertir strings a ids
      categoryId: categories.find(c => c.name === newExpense.category)?.id || 1,
      costCenterId: costCenters.find(c => c.name === newExpense.costCenter)?.id || 1,
    };
    
    // Agregar a la lista
    setExpenses([expenseToAdd, ...expenses]);
    
    // Resetear formulario
    setNewExpense({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      costCenter: '',
      description: '',
      taxAmount: '',
      taxRate: '21',
      supplierNIF: '',
      invoiceNumber: '',
      receiptImage: null
    });
  };
  
  // Función para aprobar un gasto
  const handleApproveExpense = (expenseId) => {
    setExpenses(expenses.map(expense => 
      expense.id === expenseId ? { ...expense, status: 'Aprobado' } : expense
    ));
    setShowDetailModal(false);
  };
  
  // Función para rechazar un gasto
  const handleRejectExpense = (expenseId) => {
    setExpenses(expenses.map(expense => 
      expense.id === expenseId ? { ...expense, status: 'Rechazado' } : expense
    ));
    setShowDetailModal(false);
  };
  
  // Función para eliminar un gasto
  const handleDeleteExpense = (expenseId) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
    setShowDetailModal(false);
  };
  
  // Función para procesar escaneo
  const handleScanReceipt = () => {
    if (scanStep === 1) {
      // Simulación de procesamiento de imagen
      setScanStep(2);
    } else if (scanStep === 2) {
      // Simulación de reconocimiento de datos
      setScanStep(3);
      
      // Datos ficticios extraídos por "OCR"
      setTimeout(() => {
        setNewExpense({
          ...newExpense,
          title: 'Restaurante Centro',
          amount: '97.45',
          date: new Date().toISOString().split('T')[0],
          category: 'Comidas',
          costCenter: 'Marketing',
          description: 'Comida de negocios',
          taxAmount: '16.91',
          taxRate: '21',
          supplierNIF: 'B-87654321',
          invoiceNumber: 'F-2025/287',
          receiptImage: '/api/placeholder/400/500'
        });
      }, 1000);
    } else {
      // Guardar el gasto
      handleCreateExpense();
      setScanStep(1);
      setShowScanModal(false);
      setShowScanSuccess(true);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setShowScanSuccess(false);
      }, 3000);
    }
  };
  
  // Función para aplicar filtros
  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };
  
  // Función para resetear filtros
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDateRange('thisMonth');
    setSelectedCategories([]);
    setSelectedCostCenters([]);
    setSelectedStatuses([]);
    setShowFilterModal(false);
  };
  
  // Función para exportar datos
  const handleExport = () => {
    setShowExportModal(false);
    
    // Aquí se simula la exportación
    console.log(`Exportando en formato ${exportFormat}`);
    
    // Mostrar un mensaje de éxito (en una aplicación real, esto descargará un archivo)
    alert(`Reporte exportado correctamente en formato ${exportFormat}`);
  };
  
  // Helper para clases de estado
  const getStatusColor = (status) => {
    switch(status) {
      case 'Aprobado':
        return 'bg-green-100 text-green-600';
      case 'Procesando':
        return 'bg-blue-100 text-blue-600';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-600';
      case 'Rechazado':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Helper para formatear fechas
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  // Helper para formatear dinero
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Determinar si es dispositivo móvil (simplificado)
  const isMobileView = () => {
    // En una aplicación real, esto usaría mediaQueries o una biblioteca como react-responsive
    return window.innerWidth < 768;
  };
  
  // Renderizar la pantalla de splash
  const renderSplash = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-600 z-50">
      <div className="text-center animate-fadeIn">
        <div className="flex justify-center mb-6 animate-pulse">
          <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center">
            <Receipt size={48} className="text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white animate-fadeInUp">
          ExpenseTracker
        </h1>
        <p className="text-blue-100 mt-2 animate-fadeInUp animation-delay-300">
          Sistema de gestión de gastos
        </p>
      </div>
    </div>
  );
  
  // Pantalla de Login
  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center animate-fadeIn">
        <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform hover:scale-105">
          <Receipt size={36} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 animate-fadeInUp">ExpenseTracker</h1>
        <p className="text-gray-500 mt-1 animate-fadeInUp animation-delay-200">Sistema de gestión de gastos</p>
      </div>
      
      {/* Formulario de login */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 animate-fadeInUp animation-delay-300 transition-all hover:shadow-xl">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Inicio de sesión</h2>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2 transition-all focus-within:translate-x-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="usuario@grupoempresarial.com"
              />
            </div>
          </div>
          
          <div className="space-y-2 transition-all focus-within:translate-x-1">
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 transition-transform hover:scale-110"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400 hover:text-gray-600 transition-colors" />
                ) : (
                  <Eye size={18} className="text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded transition-all focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Mantener sesión iniciada
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 flex justify-center items-center rounded-lg text-white font-medium transition-all transform hover:translate-y-[-2px] active:translate-y-0 ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              <span className="flex items-center group">
                Iniciar sesión
                <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
      </div>
      
      {/* Información de soporte */}
      <div className="mt-8 text-center text-sm text-gray-500 animate-fadeInUp animation-delay-500">
        <p>¿Necesitas ayuda? Contacta con soporte interno</p>
        <p className="mt-1">soporte@grupoempresarial.com · Ext. 2345</p>
      </div>
      
      {/* Footer */}
      <div className="mt-12 animate-fadeInUp animation-delay-700">
        <p className="text-xs text-gray-400 text-center">
          Grupo Empresarial · Sistema interno · v2.4.1
        </p>
      </div>
    </div>
  );
  
  // Menú lateral
  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
      {/* Logo y nombre de la app */}
      <div className="flex items-center p-4 border-b">
        <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Receipt size={24} className="text-white" />
        </div>
        <h1 className="ml-3 text-xl font-bold text-gray-800">ExpenseTracker</h1>
      </div>
      
      {/* Menú de navegación */}
      <nav className="mt-6 px-4">
        <ul className="space-y-1">
          <li>
            <button 
              onClick={() => setActiveSection('dashboard')} 
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeSection === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Home size={20} className="mr-3" />
              <span className="font-medium">Inicio</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('expenses')} 
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeSection === 'expenses' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FileText size={20} className="mr-3" />
              <span className="font-medium">Mis gastos</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('reports')} 
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeSection === 'reports' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <PieChart size={20} className="mr-3" />
              <span className="font-medium">Informes</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('history')} 
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeSection === 'history' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Calendar size={20} className="mr-3" />
              <span className="font-medium">Historial</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('settings')} 
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeSection === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Settings size={20} className="mr-3" />
              <span className="font-medium">Configuración</span>
            </button>
          </li>
        </ul>
      </nav>
      
      {/* Perfil y logout */}
      <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-800">Carlos Méndez</p>
            <p className="text-xs text-gray-500">carlos.mendez@grupoempresarial.com</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut size={18} className="mr-2" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
  
  // Aplicación principal - versión escritorio
  const renderDesktopApp = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-gray-800">
                {activeSection === 'dashboard' && 'Panel principal'}
                {activeSection === 'expenses' && 'Mis gastos'}
                {activeSection === 'reports' && 'Informes'}
                {activeSection === 'history' && 'Historial'}
                {activeSection === 'settings' && 'Configuración'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors">
              <Search size={20} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 relative transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center relative">
              <User size={18} className="text-blue-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Sidebar */}
      {renderSidebar()}
      
      {/* Overlay para menú móvil */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      
      {/* Main Content */}
      <main className="transition-all duration-300 lg:ml-64">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Pantalla de Dashboard */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 pt-2">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Bienvenido, Carlos</h2>
                <p className="text-gray-500">Sábado, 8 de marzo 2025</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md hover:translate-y-[-2px]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Receipt size={24} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-600 rounded-full">Hoy</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Gastos pendientes</h3>
                  <p className="text-3xl font-bold text-gray-900 my-3">
                    {formatCurrency(expenses.filter(e => e.status === 'Pendiente').reduce((sum, e) => sum + e.amount, 0))}
                  </p>
                  <div className="flex items-center text-sm text-blue-600 cursor-pointer">
                    <span>Ver detalles</span>
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md hover:translate-y-[-2px]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-600 rounded-full">Nuevo</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Facturas procesadas</h3>
                  <p className="text-3xl font-bold text-gray-900 my-3">
                    {expenses.filter(e => e.status === 'Aprobado').length}
                  </p>
                  <div className="flex items-center text-sm text-blue-600 cursor-pointer">
                    <span>Ver facturas</span>
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md hover:translate-y-[-2px]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <CircleDollarSign size={24} className="text-purple-600" />
                    </div>
                    <span className="text-sm font-medium px-2 py-1 bg-purple-100 text-purple-600 rounded-full">Este mes</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Total gastado</h3>
                  <p className="text-3xl font-bold text-gray-900 my-3">
                    {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
                  </p>
                  <div className="flex items-center text-sm text-blue-600 cursor-pointer">
                    <span>Ver informe</span>
                    <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Actividad reciente</h3>
                  <button 
                    onClick={() => setActiveSection('expenses')}
                    className="text-sm text-blue-600 font-medium"
                  >
                    Ver todo
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {expenses.slice(0, 4).map((expense) => (
                    <div 
                      key={expense.id} 
                      className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewExpense(expense.id)}
                    >
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Receipt size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-800">{expense.title}</p>
                            <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-gray-500">{formatDate(expense.date)} • {expense.category}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(expense.status)}`}>
                              {expense.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Distribución por categoría</h3>
                  </div>
                  <div className="p-6">
                    {/* Chart placeholder */}
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
                            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                              <p className="font-bold text-gray-800 text-center">Total<br/>{formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}</p>
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0">
                          <div className="flex justify-around">
                            {expensesByCategory.slice(0, 3).map((category, index) => (
                              <div key={category.id} className="text-center">
                                <div className="flex items-center space-x-1 justify-center">
                                  <div className={`h-3 w-3 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                                  <p className="text-xs">{category.name}</p>
                                </div>
                                <p className="text-sm font-medium">{Math.round((category.value / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100)}%</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Próximos vencimientos</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">Informe mensual</p>
                          <p className="text-sm text-gray-500">Fecha límite: 15 marzo</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">En 7 días</span>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">Conciliación bancaria</p>
                          <p className="text-sm text-gray-500">Fecha límite: 25 marzo</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">En 17 días</span>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">Cierre trimestral</p>
                          <p className="text-sm text-gray-500">Fecha límite: 5 abril</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">En 28 días</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Sección de Mis Gastos */}
          {activeSection === 'expenses' && (
            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Mis gastos</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={16} />
                    <span>Filtrar</span>
                  </button>
                  <button 
                    onClick={() => setShowNewExpenseModal(true)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Nuevo gasto</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="relative mr-4">
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar gastos..." 
                        className="pl-9 pr-4 py-2 border rounded-lg w-64"
                      />
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => setSelectedStatuses([])}
                        className={`px-3 py-1 text-sm border rounded-md ${selectedStatuses.length === 0 ? 'bg-blue-50 text-blue-700' : ''}`}
                      >
                        Todos
                      </button>
                      <button 
                        onClick={() => setSelectedStatuses(['Pendiente'])}
                        className={`px-3 py-1 text-sm border rounded-md ${selectedStatuses.includes('Pendiente') ? 'bg-blue-50 text-blue-700' : ''}`}
                      >
                        Pendientes
                      </button>
                      <button 
                        onClick={() => setSelectedStatuses(['Aprobado'])}
                        className={`px-3 py-1 text-sm border rounded-md ${selectedStatuses.includes('Aprobado') ? 'bg-blue-50 text-blue-700' : ''}`}
                      >
                        Aprobados
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Ordenar por:</span>
                    <select className="border rounded-md px-2 py-1 text-sm">
                      <option>Más recientes</option>
                      <option>Importe</option>
                      <option>Categoría</option>
                    </select>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <div 
                        key={expense.id} 
                        className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewExpense(expense.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <Receipt size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{expense.title}</p>
                              <div className="flex items-center space-x-1 mt-1">
                                <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                                <span className="text-xs text-gray-400">•</span>
                                <p className="text-xs text-gray-500">{expense.category}</p>
                                <span className="text-xs text-gray-400">•</span>
                                <p className="text-xs text-gray-500">{expense.costCenter}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(expense.status)}`}>
                              {expense.status}
                            </span>
                            <span className="font-semibold text-gray-800">{formatCurrency(expense.amount)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-10 text-center text-gray-500">
                      <div className="flex justify-center mb-4">
                        <AlertCircle size={48} className="text-gray-300" />
                      </div>
                      <p className="text-lg font-medium">No se encontraron gastos</p>
                      <p className="text-sm mt-1">Prueba a cambiar los filtros o crear un nuevo gasto</p>
                      <button 
                        onClick={() => setShowNewExpenseModal(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg inline-flex items-center"
                      >
                        <Plus size={16} className="mr-2" />
                        <span>Crear gasto</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {filteredExpenses.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
                    <div className="text-sm text-gray-500">Mostrando {filteredExpenses.length} de {expenses.length} gastos</div>
                    <div className="flex space-x-1">
                      <button className="px-3 py-1 border rounded-md text-sm">Anterior</button>
                      <button className="px-3 py-1 border rounded-md text-sm bg-blue-50 text-blue-700">1</button>
                      <button className="px-3 py-1 border rounded-md text-sm">2</button>
                      <button className="px-3 py-1 border rounded-md text-sm">3</button>
                      <button className="px-3 py-1 border rounded-md text-sm">Siguiente</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Sección de Informes */}
          {activeSection === 'reports' && (
            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Informes</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Download size={16} />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Distribución por centro de costo</h3>
                  </div>
                  <div className="p-6">
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-full h-full flex">
                        {expensesByCostCenter.map((item, index) => (
                          <div key={index} className="flex flex-col justify-end items-center flex-1 h-full pb-4">
                            <div 
                              className="w-4/5 bg-blue-500" 
                              style={{
                                height: `${(item.value / Math.max(...expensesByCostCenter.map(i => i.value))) * 100}%`, 
                                opacity: 0.6 + (index * 0.1)
                              }}
                            ></div>
                            <p className="text-xs mt-2 text-gray-600 truncate">{item.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Tendencia mensual</h3>
                  </div>
                  <div className="p-6">
                    <div className="h-48 flex items-end">
                      <div className="w-full h-full relative flex items-end pt-4">
                        <div className="absolute left-0 top-0 w-full border-t border-gray-200"></div>
                        <div className="absolute left-0 top-1/3 w-full border-t border-dashed border-gray-200"></div>
                        <div className="absolute left-0 top-2/3 w-full border-t border-dashed border-gray-200"></div>
                        
                        {monthlyTrend.map((item, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-3/5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm" 
                              style={{height: `${(item.amount / Math.max(...monthlyTrend.map(i => i.amount))) * 100}%`}}
                            ></div>
                            <p className="text-xs mt-2 text-gray-600">{item.month}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Informes disponibles</h3>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Nuevo informe
                  </button>
                </div>
                
                <div className="space-y-3">
                  {availableReports.map(report => (
                    <button key={report.id} className="w-full flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className={`${report.iconBg} p-2 rounded-lg`}>
                          <FileText size={20} className={report.iconColor} />
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-gray-800">{report.title}</h4>
                          <p className="text-xs text-gray-500">{report.period} • Actualizado {report.lastUpdated}</p>
                        </div>
                      </div>
                      <Download size={18} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-800 mb-4">Análisis comparativo</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Gastos por categoría (Top 5)</h4>
                    </div>
                    <div className="space-y-2">
                      {expensesByCategory.slice(0, 5).map((category) => (
                        <div key={category.id} className="flex items-center">
                          <div className="w-1/3 text-sm">{category.name}</div>
                          <div className="w-2/3 flex items-center">
                            <div 
                              className="h-2 bg-blue-500 rounded-full" 
                              style={{
                                width: `${(category.value / Math.max(...expensesByCategory.map(c => c.value))) * 100}%`,
                                maxWidth: '70%'
                              }}
                            ></div>
                            <span className="ml-2 text-sm text-gray-600">{formatCurrency(category.value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Comparativa con año anterior</h4>
                    </div>
                    <div className="flex flex-col h-40 justify-center items-center">
                      <div className="flex items-end space-x-6 mb-4">
                        <div className="flex flex-col items-center">
                          <div className="h-24 w-12 bg-gray-200 rounded-t-sm"></div>
                          <p className="text-xs mt-1 text-gray-600">2024</p>
                          <p className="text-sm font-medium">€9,458.32</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-32 w-12 bg-blue-500 rounded-t-sm"></div>
                          <p className="text-xs mt-1 text-gray-600">2025</p>
                          <p className="text-sm font-medium">{formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}</p>
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium flex items-center">
                        <TrendingUp size={16} className="mr-1" />
                        <span>+31.2% respecto al año anterior</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Sección de Historial */}
          {activeSection === 'history' && (
            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Historial de gastos</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowFilterModal(true)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Filter size={16} />
                    <span>Filtrar</span>
                  </button>
                  <button 
                    onClick={() => setShowExportModal(true)} 
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Download size={16} />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap gap-4">
                    <div className="relative flex-grow max-w-md">
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por título, factura, descripción..." 
                        className="pl-9 pr-4 py-2 border rounded-lg w-full"
                      />
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    
                    <div className="flex space-x-2">
                      <select 
                        value={selectedDateRange}
                        onChange={(e) => setSelectedDateRange(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="thisMonth">Este mes</option>
                        <option value="lastMonth">Mes anterior</option>
                        <option value="today">Hoy</option>
                        <option value="all">Todo</option>
                      </select>
                      
                      <button className="border rounded-lg px-3 py-2 flex items-center space-x-2">
                        <CalendarRange size={16} />
                        <span>Rango personalizado</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factura</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">C. Costos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expense.invoiceNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(expense.date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expense.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expense.costCenter}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(expense.status)}`}>
                              {expense.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleViewExpense(expense.id)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Ver
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteExpense(expense.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredExpenses.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>No se encontraron gastos con los filtros actuales</p>
                  </div>
                )}
                
                {filteredExpenses.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
                    <div className="text-sm text-gray-500">Mostrando {filteredExpenses.length} de {expenses.length} gastos</div>
                    <div className="flex space-x-1">
                      <button className="px-3 py-1 border rounded-md text-sm">Anterior</button>
                      <button className="px-3 py-1 border rounded-md text-sm bg-blue-50 text-blue-700">1</button>
                      <button className="px-3 py-1 border rounded-md text-sm">2</button>
                      <button className="px-3 py-1 border rounded-md text-sm">Siguiente</button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Resumen del período</h3>
                
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Total de gastos</p>
                    <p className="text-xl font-bold">{formatCurrency(filteredExpenses.reduce((sum, e) => sum + e.amount, 0))}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Cantidad de facturas</p>
                    <p className="text-xl font-bold">{filteredExpenses.length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Pendiente de aprobación</p>
                    <p className="text-xl font-bold">{formatCurrency(filteredExpenses.filter(e => e.status === 'Pendiente').reduce((sum, e) => sum + e.amount, 0))}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Gasto promedio</p>
                    <p className="text-xl font-bold">
                      {filteredExpenses.length > 0 
                        ? formatCurrency(filteredExpenses.reduce((sum, e) => sum + e.amount, 0) / filteredExpenses.length) 
                        : formatCurrency(0)
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2"
                  >
                    <Download size={16} />
                    <span>Exportar informe completo</span>
                  </button>
                  <button 
                    onClick={() => window.open('#', '_blank')}
                    className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2"
                  >
                    <ExternalLink size={16} />
                    <span>Abrir en sistema contable</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Sección de Configuración */}
          {activeSection === 'settings' && (
            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Configuración</h2>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b">
                  <nav className="flex px-6">
                    <button className="px-4 py-3 border-b-2 border-blue-500 text-blue-600 font-medium">
                      Mi perfil
                    </button>
                    <button className="px-4 py-3 text-gray-500 font-medium">
                      Notificaciones
                    </button>
                    <button className="px-4 py-3 text-gray-500 font-medium">
                      Centros de costos
                    </button>
                    <button className="px-4 py-3 text-gray-500 font-medium">
                      Categorías
                    </button>
                    <button className="px-4 py-3 text-gray-500 font-medium">
                      Integración
                    </button>
                  </nav>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start mb-8">
                    <div className="mr-6">
                      <div className="h-24 w-24 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserCircle size={48} className="text-blue-600" />
                      </div>
                      <button className="mt-3 w-full text-xs px-2 py-1 border rounded-md text-blue-600">
                        Cambiar foto
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-gray-800 mb-4">Información personal</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                          <input type="text" defaultValue="Carlos" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                          <input type="text" defaultValue="Méndez" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input type="email" defaultValue="carlos.mendez@grupoempresarial.com" className="w-full px-3 py-2 border rounded-lg" readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                          <input type="tel" defaultValue="+34 612 345 678" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                          <select className="w-full px-3 py-2 border rounded-lg">
                            <option>Marketing</option>
                            <option>Ventas</option>
                            <option>IT</option>
                            <option>Recursos Humanos</option>
                            <option>Administración</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                          <input type="text" defaultValue="Gerente Marketing" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg">
                          Cancelar
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
                          <Save size={16} className="mr-2" />
                          <span>Guardar cambios</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-xl font-medium text-gray-800 mb-4">Cambiar contraseña</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
                        <input type="password" className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div></div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
                        <input type="password" className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                        <input type="password" className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg">
                        Cancelar
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        Actualizar contraseña
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Modales - Mostrados según el estado */}
      {/* Aquí se insertarían los modales... */}
      
      {/* Estilos CSS adicionales para animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
  
  // Renderizar la aplicación
  return (
    <div>
      {currentScreen === 'splash' && renderSplash()}
      {currentScreen === 'login' && renderLogin()}
      {currentScreen === 'app' && renderDesktopApp()}
    </div>
  );
};

export default ExpenseTrackerFull;
