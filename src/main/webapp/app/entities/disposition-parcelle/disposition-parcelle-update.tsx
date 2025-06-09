import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm, isNumber } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { createEntity, getEntity, reset, updateEntity } from './disposition-parcelle.reducer';

export const DispositionParcelleUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const dispositionParcelleEntity = useAppSelector(state => state.dispositionParcelle.entity);
  const loading = useAppSelector(state => state.dispositionParcelle.loading);
  const updating = useAppSelector(state => state.dispositionParcelle.updating);
  const updateSuccess = useAppSelector(state => state.dispositionParcelle.updateSuccess);

  const handleClose = () => {
    navigate(`/disposition-parcelle${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.iddispopar !== undefined && typeof values.iddispopar !== 'number') {
      values.iddispopar = Number(values.iddispopar);
    }
    if (values.dcntagri !== undefined && typeof values.dcntagri !== 'number') {
      values.dcntagri = Number(values.dcntagri);
    }
    if (values.dcntsol !== undefined && typeof values.dcntsol !== 'number') {
      values.dcntsol = Number(values.dcntsol);
    }

    const entity = {
      ...dispositionParcelleEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...dispositionParcelleEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="immoxpertsApp.dispositionParcelle.home.createOrEditLabel" data-cy="DispositionParcelleCreateUpdateHeading">
            Créer ou éditer un Disposition Parcelle
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField name="id" required readOnly id="disposition-parcelle-id" label="ID" validate={{ required: true }} />
              ) : null}
              <ValidatedField
                label="Iddispopar"
                id="disposition-parcelle-iddispopar"
                name="iddispopar"
                data-cy="iddispopar"
                type="text"
                validate={{
                  required: { value: true, message: 'Ce champ est obligatoire.' },
                  validate: v => isNumber(v) || 'Ce champ doit être un nombre.',
                }}
              />
              <ValidatedField label="Dcntagri" id="disposition-parcelle-dcntagri" name="dcntagri" data-cy="dcntagri" type="text" />
              <ValidatedField label="Dcntsol" id="disposition-parcelle-dcntsol" name="dcntsol" data-cy="dcntsol" type="text" />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/disposition-parcelle" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Retour</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Sauvegarder
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DispositionParcelleUpdate;
