import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './adresse.reducer';

export const Adresse = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const adresseList = useAppSelector(state => state.adresse.entities);
  const loading = useAppSelector(state => state.adresse.loading);
  const totalItems = useAppSelector(state => state.adresse.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="adresse-heading" data-cy="AdresseHeading">
        Adresses
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Actualiser la liste
          </Button>
          <Link to="/adresse/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Créer un nouveau Adresse
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {adresseList && adresseList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  ID <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('idadresse')}>
                  Idadresse <FontAwesomeIcon icon={getSortIconByFieldName('idadresse')} />
                </th>
                <th className="hand" onClick={sort('novoie')}>
                  Novoie <FontAwesomeIcon icon={getSortIconByFieldName('novoie')} />
                </th>
                <th className="hand" onClick={sort('btq')}>
                  Btq <FontAwesomeIcon icon={getSortIconByFieldName('btq')} />
                </th>
                <th className="hand" onClick={sort('typvoie')}>
                  Typvoie <FontAwesomeIcon icon={getSortIconByFieldName('typvoie')} />
                </th>
                <th className="hand" onClick={sort('codvoie')}>
                  Codvoie <FontAwesomeIcon icon={getSortIconByFieldName('codvoie')} />
                </th>
                <th className="hand" onClick={sort('voie')}>
                  Voie <FontAwesomeIcon icon={getSortIconByFieldName('voie')} />
                </th>
                <th className="hand" onClick={sort('codepostal')}>
                  Codepostal <FontAwesomeIcon icon={getSortIconByFieldName('codepostal')} />
                </th>
                <th className="hand" onClick={sort('commune')}>
                  Commune <FontAwesomeIcon icon={getSortIconByFieldName('commune')} />
                </th>
                <th className="hand" onClick={sort('coddep')}>
                  Coddep <FontAwesomeIcon icon={getSortIconByFieldName('coddep')} />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {adresseList.map((adresse, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/adresse/${adresse.id}`} color="link" size="sm">
                      {adresse.id}
                    </Button>
                  </td>
                  <td>{adresse.idadresse}</td>
                  <td>{adresse.novoie}</td>
                  <td>{adresse.btq}</td>
                  <td>{adresse.typvoie}</td>
                  <td>{adresse.codvoie}</td>
                  <td>{adresse.voie}</td>
                  <td>{adresse.codepostal}</td>
                  <td>{adresse.commune}</td>
                  <td>{adresse.coddep}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/adresse/${adresse.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">Voir</span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/adresse/${adresse.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Editer</span>
                      </Button>
                      <Button
                        onClick={() =>
                          (window.location.href = `/adresse/${adresse.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Supprimer</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">Aucun Adresse trouvé</div>
        )}
      </div>
      {totalItems ? (
        <div className={adresseList && adresseList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Adresse;
