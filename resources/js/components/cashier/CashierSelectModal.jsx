import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getCashiers } from '../../api/cashiers';

export default function CashierSelectModal({ onSelect }) {
    const [cashiers, setCashiers] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        getCashiers()
            .then((list) => { setCashiers(list); if (list.length > 0) setSelected(list[0].name); })
            .catch(() => setError('Could not load cashier list.'))
            .finally(() => setLoading(false));
    }, []);

    const handleConfirm = () => {
        if (selected) onSelect(selected);
    };

    return (
        <Overlay>
            <StyledWrapper>
                <div className="bauhaus-container">
                    <div className="bauhaus-group">
                        {/* Header */}
                        <div className="bauhaus-header">
                            <span className="num">01</span>
                            <span className="title">Select Cashier</span>
                        </div>

                        {/* States */}
                        {loading && <p className="state-msg">Loading cashiers…</p>}
                        {error   && <p className="state-msg error">{error}</p>}
                        {!loading && !error && cashiers.length === 0 && (
                            <p className="state-msg">No cashiers configured. Ask an admin to add cashier names.</p>
                        )}

                        {/* Cashier radio options */}
                        {!loading && !error && cashiers.length > 0 && (
                            <div className="radio-options">
                                {cashiers.map((c) => (
                                    <label key={c.id} className="radio-item">
                                        <input
                                            type="radio"
                                            name="cashier-choice"
                                            value={c.name}
                                            checked={selected === c.name}
                                            onChange={() => setSelected(c.name)}
                                        />
                                        <span className="selector-box">
                                            <span className="shape shape-circle" />
                                        </span>
                                        <span className="label-text">{c.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {/* Confirm button */}
                        {!loading && !error && cashiers.length > 0 && (
                            <button
                                className="confirm-btn"
                                disabled={!selected}
                                onClick={handleConfirm}
                            >
                                Start Shift →
                            </button>
                        )}

                        {/* Bauhaus decorative elements */}
                        <div className="bauhaus-decoration">
                            <div className="line-v" />
                            <div className="line-h" />
                        </div>
                    </div>
                </div>
            </StyledWrapper>
        </Overlay>
    );
}

/* ── Overlay ──────────────────────────────────────────────────── */
const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
`;

/* ── Bauhaus styled wrapper ───────────────────────────────────── */
const StyledWrapper = styled.div`
  .bauhaus-container {
    --ui-bg: #f2f0e9;
    --ui-text: #1a1a1a;
    --ui-accent: #e63946;
    --ui-border: #1a1a1a;
    --bauhaus-yellow: #f4d03f;
    --bauhaus-blue: #2e86de;

    background: var(--ui-bg);
    padding: 40px 48px 40px 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 250px;
    font-family: "Inter", "Helvetica", sans-serif;
    color: var(--ui-text);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  }

  .bauhaus-group {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-left: 8px solid var(--ui-border);
    padding-left: 24px;
    min-width: 280px;
    max-width: 360px;
  }

  .bauhaus-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 10px;
  }

  .bauhaus-header .num {
    font-size: 1.2rem;
    font-weight: 900;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .bauhaus-header .title {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 700;
  }

  .state-msg {
    font-size: 0.85rem;
    color: #666;
    font-style: italic;
  }

  .state-msg.error {
    color: var(--ui-accent);
    font-style: normal;
    font-weight: 700;
  }

  .radio-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 320px;
    overflow-y: auto;
    padding-right: 4px;
  }

  .radio-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s ease;
  }

  .radio-item:hover {
    transform: translateX(8px);
  }

  .radio-item input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .selector-box {
    width: 32px;
    height: 32px;
    border: 3px solid var(--ui-border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    flex-shrink: 0;
    background: transparent;
    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .shape {
    width: 0;
    height: 0;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    opacity: 0;
  }

  .shape-circle {
    border-radius: 50%;
    background: var(--ui-accent);
  }

  /* Checked state */
  .radio-item input:checked + .selector-box {
    background: var(--ui-border);
  }

  .radio-item input:checked + .selector-box .shape {
    opacity: 1;
    width: 18px;
    height: 18px;
  }

  .label-text {
    font-size: 1.3rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    transition: color 0.3s ease;
    line-height: 1;
  }

  .radio-item input:checked ~ .label-text {
    color: var(--ui-accent);
  }

  /* Confirm button */
  .confirm-btn {
    margin-top: 8px;
    background: var(--ui-border);
    color: var(--ui-bg);
    border: none;
    padding: 12px 28px;
    font-size: 0.8rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    cursor: pointer;
    align-self: flex-start;
    transition: background 0.2s ease, transform 0.15s ease;
  }

  .confirm-btn:hover:not(:disabled) {
    background: var(--ui-accent);
    transform: translateX(4px);
  }

  .confirm-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* Bauhaus decorative elements */
  .bauhaus-decoration {
    position: absolute;
    top: -20px;
    right: -60px;
    width: 40px;
    height: 40px;
    pointer-events: none;
  }

  .line-v {
    position: absolute;
    width: 3px;
    height: 100px;
    background: var(--bauhaus-yellow);
    top: 0;
    right: 10px;
  }

  .line-h {
    position: absolute;
    width: 60px;
    height: 12px;
    background: var(--bauhaus-blue);
    bottom: -40px;
    right: -20px;
    z-index: -1;
  }
`;
