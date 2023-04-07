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

  const setLangParam = (hl) => {
    const x = {};
    if (hl) x.hl = hl;
    if (params.has("sc")) x.sc = params.get("sc");
    if (params.has("ta")) x.ta = params.get("ta");
    setParams(x);
  };

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
                onChange={({ target }) => target.checked && setLangParam()}
              />

              <FormCheck
                value={LOCALES.ENGLISH}
                label="EN"
                type="radio"
                checked={languageLocale === LOCALES.ENGLISH}
                onChange={({ target }) => target.checked && setLangParam("en")}
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
