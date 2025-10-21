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
    
    // Summary
    'summary.title': 'Riepilogo Spesa',
    'summary.share': 'Condividi su WhatsApp',
    'summary.download': 'Scarica PDF',
    'summary.noProducts': 'Nessun prodotto da acquistare',
    'summary.addProducts': 'Aggiungi prodotti dalle liste',
    
    // Manage
    'manage.title': 'Gestisci Prodotti',
    'manage.addProduct': 'Aggiungi Prodotto',
    'manage.search': 'Cerca prodotti...',
    'manage.selectAll': 'Seleziona Tutto',
    'manage.moveSelected': 'Sposta Selezionati',
    'manage.productName': 'Nome Prodotto',
    'manage.customName': 'Nome Personalizzato',
    'manage.comment': 'Commento',
    'manage.location': 'Posizione',
    'manage.assignedLists': 'Liste Assegnate',
    'manage.actions': 'Azioni',
    'manage.edit': 'Modifica',
    'manage.delete': 'Elimina',
    'manage.noProducts': 'Nessun prodotto trovato',
    
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
    
    // Summary
    'summary.title': 'Shopping Summary',
    'summary.share': 'Share on WhatsApp',
    'summary.download': 'Download PDF',
    'summary.noProducts': 'No products to buy',
    'summary.addProducts': 'Add products from lists',
    
    // Manage
    'manage.title': 'Manage Products',
    'manage.addProduct': 'Add Product',
    'manage.search': 'Search products...',
    'manage.selectAll': 'Select All',
    'manage.moveSelected': 'Move Selected',
    'manage.productName': 'Product Name',
    'manage.customName': 'Custom Name',
    'manage.comment': 'Comment',
    'manage.location': 'Location',
    'manage.assignedLists': 'Assigned Lists',
    'manage.actions': 'Actions',
    'manage.edit': 'Edit',
    'manage.delete': 'Delete',
    'manage.noProducts': 'No products found',
    
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
