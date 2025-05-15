import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';

import { NavDropdown } from './menu-components';

const adminMenuItems = () => (
  <>
    <MenuItem icon="users" to="/admin/user-management">
      Gestion des utilisateurs
    </MenuItem>
    <MenuItem icon="tachometer-alt" to="/admin/metrics">
      Métriques
    </MenuItem>
    <MenuItem icon="heart" to="/admin/health">
      Diagnostics
    </MenuItem>
    <MenuItem icon="cogs" to="/admin/configuration">
      Configuration
    </MenuItem>
    <MenuItem icon="tasks" to="/admin/logs">
      Logs
    </MenuItem>
    {/* jhipster-needle-add-element-to-admin-menu - JHipster will add entities to the admin menu here */}
  </>
);

const openAPIItem = () => (
  <MenuItem icon="book" to="/admin/docs">
    API
  </MenuItem>
);

export const AdminMenu = ({ showOpenAPI }) => (
  <NavDropdown icon="users-cog" name="Administration" id="admin-menu" data-cy="adminMenu">
    {adminMenuItems()}
    {showOpenAPI && openAPIItem()}
  </NavDropdown>
);

export default AdminMenu;
