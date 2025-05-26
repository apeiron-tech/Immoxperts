import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './adresse-dispoparc.reducer';

export const AdresseDispoparcDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const adresseDispoparcEntity = useAppSelector(state => state.adresseDispoparc.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="adresseDispoparcDetailsHeading">Adresse Dispoparc</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">Id</span>
          </dt>
          <dd>{adresseDispoparcEntity.id}</dd>
          <dt>Mutation</dt>
          <dd>{adresseDispoparcEntity.mutation ? adresseDispoparcEntity.mutation.id : ''}</dd>
          <dt>Adresse</dt>
          <dd>{adresseDispoparcEntity.adresse ? adresseDispoparcEntity.adresse.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/adresse-dispoparc" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/adresse-dispoparc/${adresseDispoparcEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editer</span>
        </Button>
      </Col>
    </Row>
  );
};

export default AdresseDispoparcDetail;
