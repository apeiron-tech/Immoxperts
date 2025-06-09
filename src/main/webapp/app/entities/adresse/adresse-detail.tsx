import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './adresse.reducer';

export const AdresseDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const adresseEntity = useAppSelector(state => state.adresse.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="adresseDetailsHeading">Adresse</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{adresseEntity.id}</dd>
          <dt>
            <span id="idadresse">Idadresse</span>
          </dt>
          <dd>{adresseEntity.idadresse}</dd>
          <dt>
            <span id="novoie">Novoie</span>
          </dt>
          <dd>{adresseEntity.novoie}</dd>
          <dt>
            <span id="btq">Btq</span>
          </dt>
          <dd>{adresseEntity.btq}</dd>
          <dt>
            <span id="typvoie">Typvoie</span>
          </dt>
          <dd>{adresseEntity.typvoie}</dd>
          <dt>
            <span id="codvoie">Codvoie</span>
          </dt>
          <dd>{adresseEntity.codvoie}</dd>
          <dt>
            <span id="voie">Voie</span>
          </dt>
          <dd>{adresseEntity.voie}</dd>
          <dt>
            <span id="codepostal">Codepostal</span>
          </dt>
          <dd>{adresseEntity.codepostal}</dd>
          <dt>
            <span id="commune">Commune</span>
          </dt>
          <dd>{adresseEntity.commune}</dd>
          <dt>
            <span id="coddep">Coddep</span>
          </dt>
          <dd>{adresseEntity.coddep}</dd>
        </dl>
        <Button tag={Link} to="/adresse" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/adresse/${adresseEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editer</span>
        </Button>
      </Col>
    </Row>
  );
};

export default AdresseDetail;
