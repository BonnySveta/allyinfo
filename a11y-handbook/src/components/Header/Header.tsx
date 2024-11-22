import { NavLink as RouterNavLink } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

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

const AdminLink = styled(NavLink)`
  color: var(--accent-color);
  
  &::before {
    content: '👑 ';
  }
`;

const AdminMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const AdminMenuContent = styled.div`
  display: none;
  position: absolute;
  background-color: var(--nav-background);
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 4px;

  ${AdminMenu}:hover & {
    display: block;
  }
`;

const AdminMenuItem = styled(NavLink)`
  color: var(--text-color);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  
  &:hover {
    background-color: var(--nav-hover-background);
  }
`;

const SupportLink = styled(NavLink)`
  color: var(--accent-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

export function Header() {
  const { isAdmin, login, logout } = useAuth();
  
  return (
    <HeaderContainer>
      <Nav>
        <NavLink to="/" end>Главная</NavLink>
        <NavLink to="/feedback">Обратная связь</NavLink>
        <NavLink to="/suggest">Предложить материал</NavLink>
        <SupportLink to="/support">
          <span role="img" aria-hidden="true">❤️</span>
          Поддержать проект
        </SupportLink>
        {isAdmin && (
          <AdminMenu>
            <AdminLink to="/admin">
              Админ-панель
            </AdminLink>
            <AdminMenuContent>
              <AdminMenuItem to="/admin/suggestions">Модерация</AdminMenuItem>
              <AdminMenuItem to="/admin/approved">Одобренные</AdminMenuItem>
              <AdminMenuItem to="/admin/feedback-list">Обратная связь</AdminMenuItem>
            </AdminMenuContent>
          </AdminMenu>
        )}
      </Nav>
      <div>
        <button onClick={isAdmin ? logout : login}>
          {isAdmin ? 'Выйти' : 'Войти как админ'}
        </button>
        <ThemeToggle />
      </div>
    </HeaderContainer>
  );
}