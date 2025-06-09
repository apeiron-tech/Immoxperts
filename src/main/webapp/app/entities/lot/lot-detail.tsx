import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './lot.reducer';

export const LotDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const lotEntity = useAppSelector(state => state.lot.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="lotDetailsHeading">Lot</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{lotEntity.id}</dd>
          <dt>
            <span id="iddispolot">Iddispolot</span>
          </dt>
          <dd>{lotEntity.iddispolot}</dd>
          <dt>
            <span id="scarrez">Scarrez</span>
          </dt>
          <dd>{lotEntity.scarrez}</dd>
        </dl>
        <Button tag={Link} to="/lot" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/lot/${lotEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editer</span>
        </Button>
      </Col>
    </Row>
  );
};

export default LotDetail;
