import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm, isNumber } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { createEntity, getEntity, reset, updateEntity } from './lot.reducer';

export const LotUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const lotEntity = useAppSelector(state => state.lot.entity);
  const loading = useAppSelector(state => state.lot.loading);
  const updating = useAppSelector(state => state.lot.updating);
  const updateSuccess = useAppSelector(state => state.lot.updateSuccess);

  const handleClose = () => {
    navigate(`/lot${location.search}`);
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
    if (values.iddispolot !== undefined && typeof values.iddispolot !== 'number') {
      values.iddispolot = Number(values.iddispolot);
    }
    if (values.scarrez !== undefined && typeof values.scarrez !== 'number') {
      values.scarrez = Number(values.scarrez);
    }

    const entity = {
      ...lotEntity,
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
          ...lotEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="immoxpertsApp.lot.home.createOrEditLabel" data-cy="LotCreateUpdateHeading">
            Créer ou éditer un Lot
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="lot-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Iddispolot"
                id="lot-iddispolot"
                name="iddispolot"
                data-cy="iddispolot"
                type="text"
                validate={{
                  required: { value: true, message: 'Ce champ est obligatoire.' },
                  validate: v => isNumber(v) || 'Ce champ doit être un nombre.',
                }}
              />
              <ValidatedField label="Scarrez" id="lot-scarrez" name="scarrez" data-cy="scarrez" type="text" />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/lot" replace color="info">
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

export default LotUpdate;
