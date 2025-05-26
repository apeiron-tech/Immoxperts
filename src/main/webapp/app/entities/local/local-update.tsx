import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm, isNumber } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { createEntity, getEntity, reset, updateEntity } from './local.reducer';

export const LocalUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const localEntity = useAppSelector(state => state.local.entity);
  const loading = useAppSelector(state => state.local.loading);
  const updating = useAppSelector(state => state.local.updating);
  const updateSuccess = useAppSelector(state => state.local.updateSuccess);

  const handleClose = () => {
    navigate(`/local${location.search}`);
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
    if (values.iddispoloc !== undefined && typeof values.iddispoloc !== 'number') {
      values.iddispoloc = Number(values.iddispoloc);
    }
    if (values.idmutation !== undefined && typeof values.idmutation !== 'number') {
      values.idmutation = Number(values.idmutation);
    }
    if (values.sbati !== undefined && typeof values.sbati !== 'number') {
      values.sbati = Number(values.sbati);
    }
    if (values.nbpprinc !== undefined && typeof values.nbpprinc !== 'number') {
      values.nbpprinc = Number(values.nbpprinc);
    }

    const entity = {
      ...localEntity,
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
          ...localEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="immoxpertsApp.local.home.createOrEditLabel" data-cy="LocalCreateUpdateHeading">
            Créer ou éditer un Local
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="local-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Iddispoloc"
                id="local-iddispoloc"
                name="iddispoloc"
                data-cy="iddispoloc"
                type="text"
                validate={{
                  required: { value: true, message: 'Ce champ est obligatoire.' },
                  validate: v => isNumber(v) || 'Ce champ doit être un nombre.',
                }}
              />
              <ValidatedField label="Idmutation" id="local-idmutation" name="idmutation" data-cy="idmutation" type="text" />
              <ValidatedField label="Sbati" id="local-sbati" name="sbati" data-cy="sbati" type="text" />
              <ValidatedField label="Libtyploc" id="local-libtyploc" name="libtyploc" data-cy="libtyploc" type="text" />
              <ValidatedField label="Nbpprinc" id="local-nbpprinc" name="nbpprinc" data-cy="nbpprinc" type="text" />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/local" replace color="info">
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

export default LocalUpdate;
