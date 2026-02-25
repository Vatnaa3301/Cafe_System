import React from 'react';
import styled from 'styled-components';

const StyledCheckbox = ({ id, checked, onChange, label }) => {
  return (
    <StyledWrapper>
      <label className="container" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <div className="checkmark" />
        {label && <span className="cb-label">{label}</span>}
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container {
    --input-focus: rgb(231, 76, 60);
    --input-out-of-focus: #ccc;
    --bg-color: #fff;
    --main-color: #323232;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .container input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkmark {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    position: relative;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    box-shadow: 3px 3px var(--main-color);
    background-color: var(--input-out-of-focus);
    transition: all 0.3s;
  }

  .container input:checked ~ .checkmark {
    background-color: var(--input-focus);
  }

  .checkmark:after {
    content: "";
    width: 5px;
    height: 11px;
    position: absolute;
    top: 3px;
    left: 6px;
    display: none;
    border: solid var(--bg-color);
    border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg);
  }

  .container input:checked ~ .checkmark:after {
    display: block;
  }

  .cb-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    line-height: 1;
  }
`;

export default StyledCheckbox;
