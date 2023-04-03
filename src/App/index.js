import { Col, Container, FormCheck, Row, Stack } from "react-bootstrap";
import { IntlProvider } from "react-intl";
import { LOCALES, messages } from "../locales";
import Home from "./Home";
import { BiMoon } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const DEFAULT_LOCALE = LOCALES.TURKISH;

export default function App() {
  const [params, setParams] = useSearchParams();

  const languageLocale = params.get("hl") === "en" ? "en-US" : "tr-TR";

  useEffect(() => {
    if (new Date().getHours() >= 18)
      document.documentElement.setAttribute("data-bs-theme", "dark");
  }, []);

  return (
    <IntlProvider
      messages={messages[languageLocale]}
      locale={languageLocale}
      defaultLocale={DEFAULT_LOCALE}
    >
      <Container fluid>
        <Row className="border-bottom py-2 px-md-4 px-1 justify-content-between">
          <Col xs="auto">
            <Stack direction="horizontal">
              <FormCheck
                className="me-2"
                value={LOCALES.TURKISH}
                label="TR"
                type="radio"
                checked={languageLocale === LOCALES.TURKISH}
                onChange={(i) => {
                  const sp = Object.fromEntries(params.entries());
                  delete sp.hl;
                  return i.target.checked && setParams(sp);
                }}
              />

              <FormCheck
                value={LOCALES.ENGLISH}
                label="EN"
                type="radio"
                checked={languageLocale === LOCALES.ENGLISH}
                onChange={(i) =>
                  i.target.checked &&
                  setParams({
                    hl: "en",
                    ...Object.fromEntries(params.entries()),
                  })
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
      </Container>

      <Home />
    </IntlProvider>
  );
}
