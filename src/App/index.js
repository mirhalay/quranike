import { useState } from "react";
import { IntlProvider } from "react-intl";
import { LOCALES, messages } from "../locales";
import Home from "./Home";

const DEFAULT_LOCALE = LOCALES.TURKISH;

export default function App() {
  const [languageLocale] = useState(
    localStorage.getItem("locale") ?? LOCALES.TURKISH
  );

  return (
    <IntlProvider
      messages={messages[languageLocale]}
      locale={languageLocale}
      defaultLocale={DEFAULT_LOCALE}
    >
      <Home />
    </IntlProvider>
  );
}
