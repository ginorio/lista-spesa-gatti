import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  it: {
    // Home
    'home.title': 'Lista Spesa Famiglia',
    'home.signOut': 'Esci',
    'home.summary': 'Riepilogo Spesa',
    'home.viewSummary': 'Vedi Riepilogo',
    'home.importPhoto': 'Importa da Foto',
    'home.manage': 'Gestisci Prodotti',
    'home.manageProducts': 'Gestisci Prodotti',
    'home.loading': 'Caricamento...',
    
    // Categories
    'category.mensile': 'Vai ai Prodotti',
    'category.bisettimanale': 'Vai ai Prodotti',
    'category.settimanale': 'Vai ai Prodotti',
    'category.trasversale': 'Vai ai Prodotti',
    'category.mensile.name': 'Spesa Mensile',
    'category.mensile.description': 'Prodotti di scorta e igiene',
    'category.bisettimanale.name': 'Spesa Bisettimanale',
    'category.bisettimanale.description': 'Dispensa con buoni',
    'category.settimanale.name': 'Spesa Settimanale',
    'category.settimanale.description': 'Prodotti freschi',
    'category.trasversale.name': 'Prodotti Trasversali',
    'category.trasversale.description': 'Disponibili in tutti i negozi',
    
    // Auth
    'auth.title': 'Lista Spesa Famiglia',
    'auth.login': 'Accedi al tuo account',
    'auth.signup': 'Crea un nuovo account per la famiglia',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.displayName': 'Nome (opzionale)',
    'auth.displayNamePlaceholder': 'Nome famiglia o utente',
    'auth.emailPlaceholder': 'famiglia@esempio.it',
    'auth.loginButton': 'Accedi',
    'auth.signupButton': 'Registrati',
    'auth.switchToSignup': 'Non hai un account? Registrati',
    'auth.switchToLogin': 'Hai già un account? Accedi',
    'auth.familyTip': 'Suggerimento: I membri della famiglia possono condividere lo stesso account usando la stessa email e password.',
    'auth.loginSuccess': 'Accesso effettuato',
    'auth.welcomeBack': 'Benvenuto!',
    'auth.signupSuccess': 'Registrazione completata',
    'auth.signupSuccessDesc': 'Accesso effettuato con successo!',
    'auth.migrating': 'Migrazione in corso',
    'auth.migratingDesc': 'Sto importando i tuoi prodotti...',
    'auth.migrationComplete': 'Migrazione completata',
    'auth.error': 'Errore',
    'auth.googleSignIn': 'Accedi con Google',
    'auth.privacy': 'Informativa Privacy',
    
    // Products
    'products.back': 'Indietro',
    'products.search': 'Cerca prodotti...',
    'products.noProducts': 'Nessun prodotto trovato',
    'products.addToList': 'Aggiungi prodotti a questa lista dalla pagina Gestisci',
    'products.continueShopping': 'Continua a fare la spesa',
    'products.goToSummary': 'Vai al Riepilogo',
    'products.notFound': 'Lista non trovata',
    
    // Summary
    'summary.title': 'Riepilogo Spesa',
    'summary.share': 'Condividi su WhatsApp',
    'summary.download': 'Scarica PDF',
    'summary.noProducts': 'Nessun prodotto selezionato',
    'summary.addProducts': 'Inizia a selezionare i prodotti per la tua spesa o importali da una foto',
    'summary.goToSelection': 'Vai alla selezione',
    'summary.productsSelected': 'prodotti selezionati',
    'summary.deleteAll': 'Cancella tutto',
    'summary.confirmDeleteAll': 'Sei sicuro di voler cancellare tutte le quantità?',
    'summary.modifySelection': 'Modifica Selezione',
    'summary.pdfGenerated': 'PDF Generato',
    'summary.pdfDescription': 'La lista della spesa è stata salvata',
    'summary.backToHome': 'Torna alla Home',
    'summary.shoppingList': 'Lista della Spesa',
    'summary.date': 'Data',
    
    // Manage
    'manage.title': 'Gestisci Prodotti',
    'manage.addProduct': 'Aggiungi Prodotto',
    'manage.addNewProduct': 'Aggiungi Nuovo Prodotto',
    'manage.search': 'Cerca prodotti...',
    'manage.selectAll': 'Seleziona Tutto',
    'manage.moveSelected': 'Sposta Selezionati',
    'manage.productName': 'Nome Prodotto',
    'manage.customName': 'Nome Personalizzato (opzionale)',
    'manage.comment': 'Commento (opzionale)',
    'manage.location': 'Posizione (opzionale)',
    'manage.assignedLists': 'Liste Assegnate',
    'manage.actions': 'Azioni',
    'manage.edit': 'Modifica',
    'manage.editProduct': 'Modifica Prodotto',
    'manage.delete': 'Elimina',
    'manage.noProducts': 'Nessun prodotto trovato',
    'manage.description': 'Aggiungi nuovi prodotti o sposta quelli esistenti',
    'manage.allProducts': 'Tutti i Prodotti',
    'manage.selectToMove': 'Seleziona prodotti per spostarli o eliminarli',
    'manage.moveProductsCount': 'Sposta Prodotti Selezionati',
    'manage.moveTo': 'Sposta in',
    'manage.moveProducts': 'Sposta Prodotti',
    'manage.cancelSelection': 'Annulla Selezione',
    'manage.shoppingLists': 'Liste di Spesa',
    'manage.saveChanges': 'Salva Modifiche',
    'manage.editNameAndLists': 'Modifica il nome e le liste associate al prodotto',
    'manage.productNamePlaceholder': 'Es: Miele biologico',
    'manage.insertProductName': 'Inserisci il nome del prodotto',
    'manage.selectAtLeastOneList': 'Seleziona almeno una lista',
    'manage.productAdded': 'Prodotto aggiunto',
    'manage.productUpdated': 'Prodotto aggiornato',
    'manage.productDeleted': 'Prodotto eliminato',
    'manage.productsMoved': 'prodotti spostati in',
    'manage.selectAtLeastOneProduct': 'Seleziona almeno un prodotto',
    'manage.confirmDelete': 'Sei sicuro di voler eliminare',
    'manage.backToHome': 'Torna alla Home',
    'manage.scanBarcode': 'Scansiona Barcode',
    'manage.barcodeScanner': 'Scanner Barcode',
    'manage.scanBarcodeDescription': 'Inquadra il codice a barre del prodotto',
    'manage.stopScanning': 'Ferma Scansione',
    'manage.startScanning': 'Avvia Scansione',
    'manage.barcodeDetected': 'Codice a barre rilevato',
    'manage.fetchingProduct': 'Recupero informazioni prodotto...',
    'manage.productNotFound': 'Prodotto non trovato nel database',
    'manage.scanError': 'Errore durante la scansione',
    
    // Photo Import
    'photo.importFromPhoto': 'Importa da Foto',
    'photo.title': 'Importa Prodotti da Foto',
    'photo.processing': 'Elaborazione immagine in corso...',
    'photo.recognized': 'Prodotti riconosciuti',
    'photo.foundProducts': 'Trovati',
    'photo.foundProductsIn': 'prodotti nell\'immagine',
    'photo.error': 'Impossibile elaborare l\'immagine',
    'photo.selectProduct': 'Seleziona il tipo di lista per ogni prodotto',
    'photo.addSelected': 'Aggiungi Selezionati',
    'photo.addAll': 'Aggiungi Tutti',
    'photo.alreadyExists': 'già esiste',
    'photo.addedToLists': 'aggiunto alle liste',
    'photo.productsAdded': 'prodotti aggiunti con successo',

    // Common
    'common.loading': 'Caricamento...',
    'common.cancel': 'Annulla',
    'common.save': 'Salva',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
  },
  en: {
    // Home
    'home.title': 'Family Shopping List',
    'home.signOut': 'Sign Out',
    'home.summary': 'Shopping Summary',
    'home.viewSummary': 'View Summary',
    'home.importPhoto': 'Import from Photo',
    'home.manage': 'Manage Products',
    'home.manageProducts': 'Manage Products',
    'home.loading': 'Loading...',
    
    // Categories
    'category.mensile': 'Go to Products',
    'category.bisettimanale': 'Go to Products',
    'category.settimanale': 'Go to Products',
    'category.trasversale': 'Go to Products',
    'category.mensile.name': 'Monthly Shopping',
    'category.mensile.description': 'Stock and hygiene products',
    'category.bisettimanale.name': 'Bi-weekly Shopping',
    'category.bisettimanale.description': 'Pantry with vouchers',
    'category.settimanale.name': 'Weekly Shopping',
    'category.settimanale.description': 'Fresh products',
    'category.trasversale.name': 'Universal Products',
    'category.trasversale.description': 'Available in all stores',
    
    // Auth
    'auth.title': 'Family Shopping List',
    'auth.login': 'Sign in to your account',
    'auth.signup': 'Create a new family account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.displayName': 'Name (optional)',
    'auth.displayNamePlaceholder': 'Family or user name',
    'auth.emailPlaceholder': 'family@example.com',
    'auth.loginButton': 'Sign In',
    'auth.signupButton': 'Sign Up',
    'auth.switchToSignup': "Don't have an account? Sign up",
    'auth.switchToLogin': 'Already have an account? Sign in',
    'auth.familyTip': 'Tip: Family members can share the same account using the same email and password.',
    'auth.loginSuccess': 'Signed in successfully',
    'auth.welcomeBack': 'Welcome back!',
    'auth.signupSuccess': 'Registration completed',
    'auth.signupSuccessDesc': 'Signed in successfully!',
    'auth.migrating': 'Migration in progress',
    'auth.migratingDesc': 'Importing your products...',
    'auth.migrationComplete': 'Migration completed',
    'auth.error': 'Error',
    'auth.googleSignIn': 'Sign in with Google',
    'auth.privacy': 'Privacy Policy',
    
    // Products
    'products.back': 'Back',
    'products.search': 'Search products...',
    'products.noProducts': 'No products found',
    'products.addToList': 'Add products to this list from the Manage page',
    'products.continueShopping': 'Continue Shopping',
    'products.goToSummary': 'Go to Summary',
    'products.notFound': 'List not found',
    
    // Summary
    'summary.title': 'Shopping Summary',
    'summary.share': 'Share on WhatsApp',
    'summary.download': 'Download PDF',
    'summary.noProducts': 'No products selected',
    'summary.addProducts': 'Start selecting products for your shopping or import them from a photo',
    'summary.goToSelection': 'Go to selection',
    'summary.productsSelected': 'products selected',
    'summary.deleteAll': 'Clear all',
    'summary.confirmDeleteAll': 'Are you sure you want to clear all quantities?',
    'summary.modifySelection': 'Modify Selection',
    'summary.pdfGenerated': 'PDF Generated',
    'summary.pdfDescription': 'Shopping list has been saved',
    'summary.backToHome': 'Back to Home',
    'summary.shoppingList': 'Shopping List',
    'summary.date': 'Date',
    
    // Manage
    'manage.title': 'Manage Products',
    'manage.addProduct': 'Add Product',
    'manage.addNewProduct': 'Add New Product',
    'manage.search': 'Search products...',
    'manage.selectAll': 'Select All',
    'manage.moveSelected': 'Move Selected',
    'manage.productName': 'Product Name',
    'manage.customName': 'Custom Name (optional)',
    'manage.comment': 'Comment (optional)',
    'manage.location': 'Location (optional)',
    'manage.assignedLists': 'Assigned Lists',
    'manage.actions': 'Actions',
    'manage.edit': 'Edit',
    'manage.editProduct': 'Edit Product',
    'manage.delete': 'Delete',
    'manage.noProducts': 'No products found',
    'manage.description': 'Add new products or move existing ones',
    'manage.allProducts': 'All Products',
    'manage.selectToMove': 'Select products to move or delete them',
    'manage.moveProductsCount': 'Move Selected Products',
    'manage.moveTo': 'Move to',
    'manage.moveProducts': 'Move Products',
    'manage.cancelSelection': 'Cancel Selection',
    'manage.shoppingLists': 'Shopping Lists',
    'manage.saveChanges': 'Save Changes',
    'manage.editNameAndLists': 'Edit the name and lists associated with the product',
    'manage.productNamePlaceholder': 'E.g.: Organic honey',
    'manage.insertProductName': 'Enter product name',
    'manage.selectAtLeastOneList': 'Select at least one list',
    'manage.productAdded': 'Product added',
    'manage.productUpdated': 'Product updated',
    'manage.productDeleted': 'Product deleted',
    'manage.productsMoved': 'products moved to',
    'manage.selectAtLeastOneProduct': 'Select at least one product',
    'manage.confirmDelete': 'Are you sure you want to delete',
    'manage.backToHome': 'Back to Home',
    'manage.scanBarcode': 'Scan Barcode',
    'manage.barcodeScanner': 'Barcode Scanner',
    'manage.scanBarcodeDescription': 'Point at the product barcode',
    'manage.stopScanning': 'Stop Scanning',
    'manage.startScanning': 'Start Scanning',
    'manage.barcodeDetected': 'Barcode detected',
    'manage.fetchingProduct': 'Fetching product info...',
    'manage.productNotFound': 'Product not found in database',
    'manage.scanError': 'Error during scanning',
    
    // Photo Import
    'photo.importFromPhoto': 'Import from Photo',
    'photo.title': 'Import Products from Photo',
    'photo.processing': 'Processing image...',
    'photo.recognized': 'Products recognized',
    'photo.foundProducts': 'Found',
    'photo.foundProductsIn': 'products in the image',
    'photo.error': 'Unable to process image',
    'photo.selectProduct': 'Select list type for each product',
    'photo.addSelected': 'Add Selected',
    'photo.addAll': 'Add All',
    'photo.alreadyExists': 'already exists',
    'photo.addedToLists': 'added to lists',
    'photo.productsAdded': 'products added successfully',

    // Common
    'common.loading': 'Loading...',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('it');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['it']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
