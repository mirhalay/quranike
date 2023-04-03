import { Col, Container, FormCheck, Row, Stack } from "react-bootstrap";
import { IntlProvider } from "react-intl";
import { LOCALES, messages } from "../locales";
import Home from "./Home";
import { BiMoon } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

const DEFAULT_LOCALE = LOCALES.TURKISH;

export default function App({ colorMode, setColorMode }) {
  const [params, setParams] = useSearchParams();

  const languageLocale = params.get("hl") === "en" ? "en-US" : "tr-TR";

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
              checked={colorMode === "dark"}
              onChange={(i) =>
                setColorMode(i.target.checked ? "dark" : "light")
              }
            />
          </Col>
        </Row>
      </Container>

      <Home />
    </IntlProvider>
  );
}
