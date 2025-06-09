import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm, isNumber } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { createEntity, getEntity, reset, updateEntity } from './mutation.reducer';

export const MutationUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const mutationEntity = useAppSelector(state => state.mutation.entity);
  const loading = useAppSelector(state => state.mutation.loading);
  const updating = useAppSelector(state => state.mutation.updating);
  const updateSuccess = useAppSelector(state => state.mutation.updateSuccess);

  const handleClose = () => {
    navigate(`/mutation${location.search}`);
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
    if (values.idmutation !== undefined && typeof values.idmutation !== 'number') {
      values.idmutation = Number(values.idmutation);
    }
    values.datemut = convertDateTimeToServer(values.datemut);
    if (values.valeurfonc !== undefined && typeof values.valeurfonc !== 'number') {
      values.valeurfonc = Number(values.valeurfonc);
    }
    if (values.idnatmut !== undefined && typeof values.idnatmut !== 'number') {
      values.idnatmut = Number(values.idnatmut);
    }
    if (values.sterr !== undefined && typeof values.sterr !== 'number') {
      values.sterr = Number(values.sterr);
    }

    const entity = {
      ...mutationEntity,
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
      ? {
          datemut: displayDefaultDateTime(),
        }
      : {
          ...mutationEntity,
          datemut: convertDateTimeFromServer(mutationEntity.datemut),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="immoxpertsApp.mutation.home.createOrEditLabel" data-cy="MutationCreateUpdateHeading">
            Créer ou éditer un Mutation
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="mutation-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Idmutation"
                id="mutation-idmutation"
                name="idmutation"
                data-cy="idmutation"
                type="text"
                validate={{
                  required: { value: true, message: 'Ce champ est obligatoire.' },
                  validate: v => isNumber(v) || 'Ce champ doit être un nombre.',
                }}
              />
              <ValidatedField
                label="Datemut"
                id="mutation-datemut"
                name="datemut"
                data-cy="datemut"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField label="Valeurfonc" id="mutation-valeurfonc" name="valeurfonc" data-cy="valeurfonc" type="text" />
              <ValidatedField label="Idnatmut" id="mutation-idnatmut" name="idnatmut" data-cy="idnatmut" type="text" />
              <ValidatedField label="Coddep" id="mutation-coddep" name="coddep" data-cy="coddep" type="text" />
              <ValidatedField label="Vefa" id="mutation-vefa" name="vefa" data-cy="vefa" check type="checkbox" />
              <ValidatedField label="Sterr" id="mutation-sterr" name="sterr" data-cy="sterr" type="text" />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/mutation" replace color="info">
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

export default MutationUpdate;
