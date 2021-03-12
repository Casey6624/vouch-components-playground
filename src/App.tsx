import React, { useState } from "react";
import styled from "styled-components";
import SteppedInput from "./SteppedInput";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

function App() {
  const [value, setValue] = useState([]);
  const [errors, setError] = useState([]);

  return (
    <div className="App">
      <Container>
        <h4>{value.join("/")}</h4>
        <SteppedInput
          config={[
            { label: "Day", length: 2, maxVal: 31, minVal: 1 },
            {
              label: "Month",
              length: 2,
              maxVal: 12,
              minVal: 1,
            },
            {
              label: "Year",
              length: 4,
              maxVal: new Date().getFullYear(),
              minVal: 1900,
            },
          ]}
          isDate
          onError={setError}
          label="dob"
          onChange={setValue}
          values={value}
          divider="/"
        />
        <ul>
          {errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

export default App;
