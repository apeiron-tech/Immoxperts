import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './local.reducer';

export const LocalDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const localEntity = useAppSelector(state => state.local.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="localDetailsHeading">Local</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{localEntity.id}</dd>
          <dt>
            <span id="iddispoloc">Iddispoloc</span>
          </dt>
          <dd>{localEntity.iddispoloc}</dd>
          <dt>
            <span id="idmutation">Idmutation</span>
          </dt>
          <dd>{localEntity.idmutation}</dd>
          <dt>
            <span id="sbati">Sbati</span>
          </dt>
          <dd>{localEntity.sbati}</dd>
          <dt>
            <span id="libtyploc">Libtyploc</span>
          </dt>
          <dd>{localEntity.libtyploc}</dd>
          <dt>
            <span id="nbpprinc">Nbpprinc</span>
          </dt>
          <dd>{localEntity.nbpprinc}</dd>
        </dl>
        <Button tag={Link} to="/local" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/local/${localEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editer</span>
        </Button>
      </Col>
    </Row>
  );
};

export default LocalDetail;
