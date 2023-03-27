import { useState } from "react";
import { FormCheck, Stack } from "react-bootstrap";
import { IntlProvider } from "react-intl";
import { LOCALES, messages } from "../locales";
import Home from "./Home";

const DEFAULT_LOCALE = LOCALES.TURKISH;

export default function App() {
  const [languageLocale, setLanguageLocale] = useState(LOCALES.TURKISH);

  return (
    <IntlProvider
      messages={messages[languageLocale]}
      locale={languageLocale}
      defaultLocale={DEFAULT_LOCALE}
    >
      <>
        <div className="border-bottom py-2 px-4">
          <Stack direction="horizontal">
            <FormCheck
              className="me-2"
              value={LOCALES.TURKISH}
              label="Türkçe"
              type="radio"
              checked={languageLocale === LOCALES.TURKISH}
              onChange={(i) =>
                i.target.checked && setLanguageLocale(i.target.value)
              }
            />

            <FormCheck
              value={LOCALES.ENGLISH}
              label="English"
              type="radio"
              checked={languageLocale === LOCALES.ENGLISH}
              onChange={(i) =>
                i.target.checked && setLanguageLocale(i.target.value)
              }
            />
          </Stack>
        </div>
        <Home />
      </>
    </IntlProvider>
  );
}
