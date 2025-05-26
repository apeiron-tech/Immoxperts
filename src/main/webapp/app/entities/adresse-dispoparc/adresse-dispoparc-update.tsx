import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getMutations } from 'app/entities/mutation/mutation.reducer';
import { getEntities as getAdresses } from 'app/entities/adresse/adresse.reducer';
import { createEntity, getEntity, reset, updateEntity } from './adresse-dispoparc.reducer';

export const AdresseDispoparcUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const mutations = useAppSelector(state => state.mutation.entities);
  const adresses = useAppSelector(state => state.adresse.entities);
  const adresseDispoparcEntity = useAppSelector(state => state.adresseDispoparc.entity);
  const loading = useAppSelector(state => state.adresseDispoparc.loading);
  const updating = useAppSelector(state => state.adresseDispoparc.updating);
  const updateSuccess = useAppSelector(state => state.adresseDispoparc.updateSuccess);

  const handleClose = () => {
    navigate(`/adresse-dispoparc${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getMutations({}));
    dispatch(getAdresses({}));
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

    const entity = {
      ...adresseDispoparcEntity,
      ...values,
      mutation: mutations.find(it => it.id.toString() === values.mutation?.toString()),
      adresse: adresses.find(it => it.id.toString() === values.adresse?.toString()),
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
          ...adresseDispoparcEntity,
          mutation: adresseDispoparcEntity?.mutation?.id,
          adresse: adresseDispoparcEntity?.adresse?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="immoxpertsApp.adresseDispoparc.home.createOrEditLabel" data-cy="AdresseDispoparcCreateUpdateHeading">
            Créer ou éditer un Adresse Dispoparc
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
                <ValidatedField name="id" required readOnly id="adresse-dispoparc-id" label="Id" validate={{ required: true }} />
              ) : null}
              <ValidatedField id="adresse-dispoparc-mutation" name="mutation" data-cy="mutation" label="Mutation" type="select">
                <option value="" key="0" />
                {mutations
                  ? mutations.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="adresse-dispoparc-adresse" name="adresse" data-cy="adresse" label="Adresse" type="select">
                <option value="" key="0" />
                {adresses
                  ? adresses.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/adresse-dispoparc" replace color="info">
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

export default AdresseDispoparcUpdate;
