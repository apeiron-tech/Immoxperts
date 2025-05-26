import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './mutation.reducer';

export const MutationDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const mutationEntity = useAppSelector(state => state.mutation.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="mutationDetailsHeading">Mutation</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{mutationEntity.id}</dd>
          <dt>
            <span id="idmutation">Idmutation</span>
          </dt>
          <dd>{mutationEntity.idmutation}</dd>
          <dt>
            <span id="datemut">Datemut</span>
          </dt>
          <dd>{mutationEntity.datemut ? <TextFormat value={mutationEntity.datemut} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="valeurfonc">Valeurfonc</span>
          </dt>
          <dd>{mutationEntity.valeurfonc}</dd>
          <dt>
            <span id="idnatmut">Idnatmut</span>
          </dt>
          <dd>{mutationEntity.idnatmut}</dd>
          <dt>
            <span id="coddep">Coddep</span>
          </dt>
          <dd>{mutationEntity.coddep}</dd>
          <dt>
            <span id="vefa">Vefa</span>
          </dt>
          <dd>{mutationEntity.vefa ? 'true' : 'false'}</dd>
          <dt>
            <span id="sterr">Sterr</span>
          </dt>
          <dd>{mutationEntity.sterr}</dd>
        </dl>
        <Button tag={Link} to="/mutation" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/mutation/${mutationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editer</span>
        </Button>
      </Col>
    </Row>
  );
};

export default MutationDetail;
