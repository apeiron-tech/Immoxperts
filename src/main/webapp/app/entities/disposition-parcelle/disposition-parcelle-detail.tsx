import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './disposition-parcelle.reducer';

export const DispositionParcelleDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const dispositionParcelleEntity = useAppSelector(state => state.dispositionParcelle.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="dispositionParcelleDetailsHeading">Disposition Parcelle</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{dispositionParcelleEntity.id}</dd>
          <dt>
            <span id="iddispopar">Iddispopar</span>
          </dt>
          <dd>{dispositionParcelleEntity.iddispopar}</dd>
          <dt>
            <span id="dcntagri">Dcntagri</span>
          </dt>
          <dd>{dispositionParcelleEntity.dcntagri}</dd>
          <dt>
            <span id="dcntsol">Dcntsol</span>
          </dt>
          <dd>{dispositionParcelleEntity.dcntsol}</dd>
        </dl>
        <Button tag={Link} to="/disposition-parcelle" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/disposition-parcelle/${dispositionParcelleEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editer</span>
        </Button>
      </Col>
    </Row>
  );
};

export default DispositionParcelleDetail;
