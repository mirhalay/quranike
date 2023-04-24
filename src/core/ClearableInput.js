import { useRef } from "react";
import { CloseButton, FormControl, InputGroup } from "react-bootstrap";

export default function ClearableInput(props) {
  const txtRef = useRef();

  return (
    <InputGroup className="d-flex">
      <FormControl ref={txtRef} {...props} className="pe-5" />
      <CloseButton
        className="border-0"
        style={{
          position: "absolute",
          left: "calc(100% - 30px)",
          top: "calc(100% - 30px)",
          zIndex: "100",
        }}
        onClick={() => {
          txtRef.current.value = "";
          txtRef.current.focus();
        }}
      />
    </InputGroup>
  );
}
