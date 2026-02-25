import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  button {
    --button_radius: 0.75em;
    --button_color: ${({ $active }) => $active ? '#f97316' : '#ffffff'};
    --button_outline_color: ${({ $active }) => $active ? '#c2410c' : '#d1d5db'};
    font-size: 14px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    border-radius: var(--button_radius);
    background: var(--button_outline_color);
    flex-shrink: 0;
  }

  .button_top {
    display: flex;
    align-items: center;
    gap: 6px;
    box-sizing: border-box;
    border: 0.0px solid var(--button_outline_color);
    border-radius: var(--button_radius);
    padding: 0.5em 1.1em;
    background: var(--button_color);
    color: ${({ $active }) => $active ? '#fff' : '#374151'};
    transform: translateY(-0.2em);
    transition: transform 0.1s ease, background 0.15s ease;
    white-space: nowrap;
  }

  button:hover .button_top {
    transform: translateY(-0.33em);
    background: ${({ $active }) => $active ? '#fb923c' : '#f9fafb'};
  }

  button:active .button_top {
    transform: translateY(0);
  }
`;

export default function CategoryFilter({ categories, active, onChange }) {
    const all = [{ id: '', name: 'All', image: null }, ...categories];

    return (
        <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-hide">
            {all.map((cat) => {
                const isActive = active === cat.id;
                return (
                    <StyledWrapper key={cat.id} $active={isActive}>
                        <button onClick={() => onChange(cat.id)}>
                            <span className="button_top">
                                {cat.image ? (
                                    <img src={`/storage/${cat.image}`} alt={cat.name} style={{ height: '16px', width: '16px', objectFit: 'contain', flexShrink: 0 }} />
                                ) : (
                                    <svg style={{ height: '16px', width: '16px', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                                        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                                    </svg>
                                )}
                                {cat.name}
                            </span>
                        </button>
                    </StyledWrapper>
                );
            })}
        </div>
    );
}
