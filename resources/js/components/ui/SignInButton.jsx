import React from 'react';
import styled from 'styled-components';

const SignInButton = ({ children, ...props }) => {
  return (
    <StyledWrapper>
      <button {...props}>
        <span className="button_top">{children}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;

  button {
    --button_radius: 0;
    --button_color: rgb(231, 76, 60);
    --button_outline_color: #000000;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    border-radius: var(--button_radius);
    background: var(--button_outline_color);
    width: 100%;
  }

  .button_top {
    display: block;
    box-sizing: border-box;
    border: 3px solid var(--button_outline_color);
    border-radius: var(--button_radius);
    padding: 0.85em 1.5em;
    background: var(--button_color);
    color: var(--button_outline_color);
    transform: translateY(-0.25em);
    transition: transform 0.1s ease;
    width: 100%;
    text-align: center;
  }

  button:hover:not(:disabled) .button_top {
    transform: translateY(-0.4em);
  }

  button:active:not(:disabled) .button_top {
    transform: translateY(0);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default SignInButton;
