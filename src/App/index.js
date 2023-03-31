import { useState } from "react";
import { Col, FormCheck, Row, Stack } from "react-bootstrap";
import { IntlProvider } from "react-intl";
import { LOCALES, messages } from "../locales";
import Home from "./Home";
import { BiMoon } from "react-icons/bi";

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
        <Row
          direction="horizontal"
          className="border-bottom py-2 px-4 justify-content-between"
        >
          <Col xs="auto">
            <Stack direction="horizontal">
              <FormCheck
                className="me-2"
                value={LOCALES.TURKISH}
                label="TR"
                type="radio"
                checked={languageLocale === LOCALES.TURKISH}
                onChange={(i) =>
                  i.target.checked && setLanguageLocale(i.target.value)
                }
              />

              <FormCheck
                value={LOCALES.ENGLISH}
                label="EN"
                type="radio"
                checked={languageLocale === LOCALES.ENGLISH}
                onChange={(i) =>
                  i.target.checked && setLanguageLocale(i.target.value)
                }
              />
            </Stack>
          </Col>

          <Col xs="auto">
            <FormCheck
              label={<BiMoon />}
              type="switch"
              onChange={() =>
                document.documentElement.setAttribute(
                  "data-bs-theme",
                  document.documentElement.getAttribute("data-bs-theme") ===
                    "dark"
                    ? "light"
                    : "dark"
                )
              }
            />
          </Col>
        </Row>

        <Home />
      </>
    </IntlProvider>
  );
}
