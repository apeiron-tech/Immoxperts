import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './adresse-local.reducer';

export const AdresseLocalDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const adresseLocalEntity = useAppSelector(state => state.adresseLocal.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="adresseLocalDetailsHeading">Adresse Local</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">Id</span>
          </dt>
          <dd>{adresseLocalEntity.id}</dd>
          <dt>
            <span id="coddep">Coddep</span>
          </dt>
          <dd>{adresseLocalEntity.coddep}</dd>
          <dt>Mutation</dt>
          <dd>{adresseLocalEntity.mutation ? adresseLocalEntity.mutation.id : ''}</dd>
          <dt>Adresse</dt>
          <dd>{adresseLocalEntity.adresse ? adresseLocalEntity.adresse.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/adresse-local" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/adresse-local/${adresseLocalEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editer</span>
        </Button>
      </Col>
    </Row>
  );
};

export default AdresseLocalDetail;
