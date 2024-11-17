import { NavLink as RouterNavLink } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--nav-background);
  color: var(--text-color);
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => 
    theme.mode === 'light' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(RouterNavLink)`
  text-decoration: none;
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background-color: var(--nav-hover-background);
  }

  &.active {
    font-weight: 500;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--accent-color);
      transition: transform 0.3s ease;
    }
  }
`;

export function Header() {
  return (
    <HeaderContainer>
      <Nav>
        <NavLink to="/" end>Главная</NavLink>
        <NavLink to="/feedback">Обратная связь</NavLink>
        <NavLink to="/suggest">Предложить материал</NavLink>
      </Nav>
      <ThemeToggle />
    </HeaderContainer>
  );
} 