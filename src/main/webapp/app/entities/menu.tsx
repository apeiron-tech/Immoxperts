import React from 'react';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/mutation">
        Mutation
      </MenuItem>
      <MenuItem icon="asterisk" to="/adresse">
        Adresse
      </MenuItem>
      <MenuItem icon="asterisk" to="/local">
        Local
      </MenuItem>
      <MenuItem icon="asterisk" to="/lot">
        Lot
      </MenuItem>
      <MenuItem icon="asterisk" to="/disposition-parcelle">
        Disposition Parcelle
      </MenuItem>
      <MenuItem icon="asterisk" to="/adresse-local">
        Adresse Local
      </MenuItem>
      <MenuItem icon="asterisk" to="/adresse-dispoparc">
        Adresse Dispoparc
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
