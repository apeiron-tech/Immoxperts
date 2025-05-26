import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm, isNumber } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { createEntity, getEntity, reset, updateEntity } from './adresse.reducer';

export const AdresseUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const adresseEntity = useAppSelector(state => state.adresse.entity);
  const loading = useAppSelector(state => state.adresse.loading);
  const updating = useAppSelector(state => state.adresse.updating);
  const updateSuccess = useAppSelector(state => state.adresse.updateSuccess);

  const handleClose = () => {
    navigate(`/adresse${location.search}`);
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
    if (values.idadresse !== undefined && typeof values.idadresse !== 'number') {
      values.idadresse = Number(values.idadresse);
    }
    if (values.novoie !== undefined && typeof values.novoie !== 'number') {
      values.novoie = Number(values.novoie);
    }

    const entity = {
      ...adresseEntity,
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
          ...adresseEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="immoxpertsApp.adresse.home.createOrEditLabel" data-cy="AdresseCreateUpdateHeading">
            Créer ou éditer un Adresse
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="adresse-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Idadresse"
                id="adresse-idadresse"
                name="idadresse"
                data-cy="idadresse"
                type="text"
                validate={{
                  required: { value: true, message: 'Ce champ est obligatoire.' },
                  validate: v => isNumber(v) || 'Ce champ doit être un nombre.',
                }}
              />
              <ValidatedField label="Novoie" id="adresse-novoie" name="novoie" data-cy="novoie" type="text" />
              <ValidatedField label="Btq" id="adresse-btq" name="btq" data-cy="btq" type="text" />
              <ValidatedField label="Typvoie" id="adresse-typvoie" name="typvoie" data-cy="typvoie" type="text" />
              <ValidatedField label="Codvoie" id="adresse-codvoie" name="codvoie" data-cy="codvoie" type="text" />
              <ValidatedField label="Voie" id="adresse-voie" name="voie" data-cy="voie" type="text" />
              <ValidatedField label="Codepostal" id="adresse-codepostal" name="codepostal" data-cy="codepostal" type="text" />
              <ValidatedField label="Commune" id="adresse-commune" name="commune" data-cy="commune" type="text" />
              <ValidatedField label="Coddep" id="adresse-coddep" name="coddep" data-cy="coddep" type="text" />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/adresse" replace color="info">
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

export default AdresseUpdate;
