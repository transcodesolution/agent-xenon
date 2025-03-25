import { Group, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { compilerVersionAndLanguages } from '@agent-xenon/resources'

interface ILanguageSelector {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  editorTheme: string;
  onThemeChange: (theme: string) => void;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  editorTheme,
  onThemeChange,
}: ILanguageSelector) {
  const [allLanguages, setAllLanguages] = useState<{ value: string; label: string }[]>([]);
  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "high-contrast-dark", label: "High Contrast" },
  ];

  useEffect(() => {
    const formattedLanguages = compilerVersionAndLanguages.map((lang) => ({
      value: lang.language,
      label: lang.language, // Use alias if available
    }));
    setAllLanguages(formattedLanguages);
  }, []);


  return (
    <Group gap="md">
      <Select
        data={allLanguages}
        value={selectedLanguage}
        onChange={(value) => onLanguageChange(value || 'javascript')}
        label=""
        size="sm"
      />
      <Select
        data={themes}
        value={editorTheme}
        onChange={(value) => onThemeChange(value || 'vs-dark')}
        label=""
        size="sm"
      />
    </Group>
  );
}