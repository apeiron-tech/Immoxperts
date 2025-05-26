import mutation from 'app/entities/mutation/mutation.reducer';
import adresse from 'app/entities/adresse/adresse.reducer';
import local from 'app/entities/local/local.reducer';
import lot from 'app/entities/lot/lot.reducer';
import dispositionParcelle from 'app/entities/disposition-parcelle/disposition-parcelle.reducer';
import adresseLocal from 'app/entities/adresse-local/adresse-local.reducer';
import adresseDispoparc from 'app/entities/adresse-dispoparc/adresse-dispoparc.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  mutation,
  adresse,
  local,
  lot,
  dispositionParcelle,
  adresseLocal,
  adresseDispoparc,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
