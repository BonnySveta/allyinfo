import styled from 'styled-components';

export const Panel = styled.section`
  padding: 0 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const VisuallyHidden = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const SelectedCount = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary-color);
  margin-top: 0.5rem;
`;

export const ClearButton = styled.button`
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
`; 