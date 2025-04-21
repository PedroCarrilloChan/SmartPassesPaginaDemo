import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Guardar el idioma en localStorage
    localStorage.setItem('language', lng);
  };

  // Determinar el idioma actual
  const currentLanguage = i18n.language || 'es';

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30">
            <Globe className="h-4 w-4 text-white" />
            <span className="sr-only">Cambiar idioma</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-card bg-white/20 backdrop-blur-xl border border-white/30 text-white">
          <DropdownMenuItem 
            onClick={() => changeLanguage('es')}
            className={`${currentLanguage === 'es' ? 'bg-white/20' : ''} hover:bg-white/30 cursor-pointer`}
          >
            🇪🇸 {t('language.switchToSpanish')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => changeLanguage('en')}
            className={`${currentLanguage === 'en' ? 'bg-white/20' : ''} hover:bg-white/30 cursor-pointer`}
          >
            🇺🇸 {t('language.switchToEnglish')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default LanguageSwitcher;