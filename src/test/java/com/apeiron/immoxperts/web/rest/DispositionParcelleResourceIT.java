package com.apeiron.immoxperts.web.rest;

import static com.apeiron.immoxperts.domain.DispositionParcelleAsserts.*;
import static com.apeiron.immoxperts.web.rest.TestUtil.createUpdateProxyForBean;
import static com.apeiron.immoxperts.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.apeiron.immoxperts.IntegrationTest;
import com.apeiron.immoxperts.domain.DispositionParcelle;
import com.apeiron.immoxperts.repository.DispositionParcelleRepository;
import com.apeiron.immoxperts.service.dto.DispositionParcelleDTO;
import com.apeiron.immoxperts.service.mapper.DispositionParcelleMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DispositionParcelleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DispositionParcelleResourceIT {

    private static final Integer DEFAULT_IDDISPOPAR = 1;
    private static final Integer UPDATED_IDDISPOPAR = 2;

    private static final BigDecimal DEFAULT_DCNTAGRI = new BigDecimal(1);
    private static final BigDecimal UPDATED_DCNTAGRI = new BigDecimal(2);

    private static final BigDecimal DEFAULT_DCNTSOL = new BigDecimal(1);
    private static final BigDecimal UPDATED_DCNTSOL = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/disposition-parcelles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DispositionParcelleRepository dispositionParcelleRepository;

    @Autowired
    private DispositionParcelleMapper dispositionParcelleMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDispositionParcelleMockMvc;

    private DispositionParcelle dispositionParcelle;

    private DispositionParcelle insertedDispositionParcelle;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DispositionParcelle createEntity() {
        return new DispositionParcelle().iddispopar(DEFAULT_IDDISPOPAR).dcntagri(DEFAULT_DCNTAGRI).dcntsol(DEFAULT_DCNTSOL);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DispositionParcelle createUpdatedEntity() {
        return new DispositionParcelle().iddispopar(UPDATED_IDDISPOPAR).dcntagri(UPDATED_DCNTAGRI).dcntsol(UPDATED_DCNTSOL);
    }

    @BeforeEach
    void initTest() {
        dispositionParcelle = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedDispositionParcelle != null) {
            dispositionParcelleRepository.delete(insertedDispositionParcelle);
            insertedDispositionParcelle = null;
        }
    }

    @Test
    @Transactional
    void createDispositionParcelle() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the DispositionParcelle
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(dispositionParcelle);
        var returnedDispositionParcelleDTO = om.readValue(
            restDispositionParcelleMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(dispositionParcelleDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            DispositionParcelleDTO.class
        );

        // Validate the DispositionParcelle in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedDispositionParcelle = dispositionParcelleMapper.toEntity(returnedDispositionParcelleDTO);
        assertDispositionParcelleUpdatableFieldsEquals(
            returnedDispositionParcelle,
            getPersistedDispositionParcelle(returnedDispositionParcelle)
        );

        insertedDispositionParcelle = returnedDispositionParcelle;
    }

    @Test
    @Transactional
    void createDispositionParcelleWithExistingId() throws Exception {
        // Create the DispositionParcelle with an existing ID
        dispositionParcelle.setId(1L);
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(dispositionParcelle);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDispositionParcelleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(dispositionParcelleDTO)))
            .andExpect(status().isBadRequest());

        // Validate the DispositionParcelle in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkIddispoparIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        dispositionParcelle.setIddispopar(null);

        // Create the DispositionParcelle, which fails.
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(dispositionParcelle);

        restDispositionParcelleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(dispositionParcelleDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDispositionParcelles() throws Exception {
        // Initialize the database
        insertedDispositionParcelle = dispositionParcelleRepository.saveAndFlush(dispositionParcelle);

        // Get all the dispositionParcelleList
        restDispositionParcelleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dispositionParcelle.getId().intValue())))
            .andExpect(jsonPath("$.[*].iddispopar").value(hasItem(DEFAULT_IDDISPOPAR)))
            .andExpect(jsonPath("$.[*].dcntagri").value(hasItem(sameNumber(DEFAULT_DCNTAGRI))))
            .andExpect(jsonPath("$.[*].dcntsol").value(hasItem(sameNumber(DEFAULT_DCNTSOL))));
    }

    @Test
    @Transactional
    void getDispositionParcelle() throws Exception {
        // Initialize the database
        insertedDispositionParcelle = dispositionParcelleRepository.saveAndFlush(dispositionParcelle);

        // Get the dispositionParcelle
        restDispositionParcelleMockMvc
            .perform(get(ENTITY_API_URL_ID, dispositionParcelle.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dispositionParcelle.getId().intValue()))
            .andExpect(jsonPath("$.iddispopar").value(DEFAULT_IDDISPOPAR))
            .andExpect(jsonPath("$.dcntagri").value(sameNumber(DEFAULT_DCNTAGRI)))
            .andExpect(jsonPath("$.dcntsol").value(sameNumber(DEFAULT_DCNTSOL)));
    }

    @Test
    @Transactional
    void getNonExistingDispositionParcelle() throws Exception {
        // Get the dispositionParcelle
        restDispositionParcelleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDispositionParcelle() throws Exception {
        // Initialize the database
        insertedDispositionParcelle = dispositionParcelleRepository.saveAndFlush(dispositionParcelle);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the dispositionParcelle
        DispositionParcelle updatedDispositionParcelle = dispositionParcelleRepository.findById(dispositionParcelle.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDispositionParcelle are not directly saved in db
        em.detach(updatedDispositionParcelle);
        updatedDispositionParcelle.iddispopar(UPDATED_IDDISPOPAR).dcntagri(UPDATED_DCNTAGRI).dcntsol(UPDATED_DCNTSOL);
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(updatedDispositionParcelle);

        restDispositionParcelleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dispositionParcelleDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(dispositionParcelleDTO))
            )
            .andExpect(status().isOk());

        // Validate the DispositionParcelle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDispositionParcelleToMatchAllProperties(updatedDispositionParcelle);
    }

    @Test
    @Transactional
    void putNonExistingDispositionParcelle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dispositionParcelle.setId(longCount.incrementAndGet());

        // Create the DispositionParcelle
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(dispositionParcelle);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDispositionParcelleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dispositionParcelleDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(dispositionParcelleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DispositionParcelle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDispositionParcelle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dispositionParcelle.setId(longCount.incrementAndGet());

        // Create the DispositionParcelle
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(dispositionParcelle);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDispositionParcelleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(dispositionParcelleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DispositionParcelle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDispositionParcelle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dispositionParcelle.setId(longCount.incrementAndGet());

        // Create the DispositionParcelle
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(dispositionParcelle);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDispositionParcelleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(dispositionParcelleDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DispositionParcelle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDispositionParcelleWithPatch() throws Exception {
        // Initialize the database
        insertedDispositionParcelle = dispositionParcelleRepository.saveAndFlush(dispositionParcelle);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the dispositionParcelle using partial update
        DispositionParcelle partialUpdatedDispositionParcelle = new DispositionParcelle();
        partialUpdatedDispositionParcelle.setId(dispositionParcelle.getId());

        partialUpdatedDispositionParcelle.iddispopar(UPDATED_IDDISPOPAR);

        restDispositionParcelleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDispositionParcelle.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDispositionParcelle))
            )
            .andExpect(status().isOk());

        // Validate the DispositionParcelle in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDispositionParcelleUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedDispositionParcelle, dispositionParcelle),
            getPersistedDispositionParcelle(dispositionParcelle)
        );
    }

    @Test
    @Transactional
    void fullUpdateDispositionParcelleWithPatch() throws Exception {
        // Initialize the database
        insertedDispositionParcelle = dispositionParcelleRepository.saveAndFlush(dispositionParcelle);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the dispositionParcelle using partial update
        DispositionParcelle partialUpdatedDispositionParcelle = new DispositionParcelle();
        partialUpdatedDispositionParcelle.setId(dispositionParcelle.getId());

        partialUpdatedDispositionParcelle.iddispopar(UPDATED_IDDISPOPAR).dcntagri(UPDATED_DCNTAGRI).dcntsol(UPDATED_DCNTSOL);

        restDispositionParcelleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDispositionParcelle.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDispositionParcelle))
            )
            .andExpect(status().isOk());

        // Validate the DispositionParcelle in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDispositionParcelleUpdatableFieldsEquals(
            partialUpdatedDispositionParcelle,
            getPersistedDispositionParcelle(partialUpdatedDispositionParcelle)
        );
    }

    @Test
    @Transactional
    void patchNonExistingDispositionParcelle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dispositionParcelle.setId(longCount.incrementAndGet());

        // Create the DispositionParcelle
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(dispositionParcelle);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDispositionParcelleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dispositionParcelleDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(dispositionParcelleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DispositionParcelle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDispositionParcelle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dispositionParcelle.setId(longCount.incrementAndGet());

        // Create the DispositionParcelle
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(dispositionParcelle);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDispositionParcelleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(dispositionParcelleDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the DispositionParcelle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDispositionParcelle() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dispositionParcelle.setId(longCount.incrementAndGet());

        // Create the DispositionParcelle
        DispositionParcelleDTO dispositionParcelleDTO = dispositionParcelleMapper.toDto(dispositionParcelle);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDispositionParcelleMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(dispositionParcelleDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DispositionParcelle in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDispositionParcelle() throws Exception {
        // Initialize the database
        insertedDispositionParcelle = dispositionParcelleRepository.saveAndFlush(dispositionParcelle);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the dispositionParcelle
        restDispositionParcelleMockMvc
            .perform(delete(ENTITY_API_URL_ID, dispositionParcelle.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return dispositionParcelleRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected DispositionParcelle getPersistedDispositionParcelle(DispositionParcelle dispositionParcelle) {
        return dispositionParcelleRepository.findById(dispositionParcelle.getId()).orElseThrow();
    }

    protected void assertPersistedDispositionParcelleToMatchAllProperties(DispositionParcelle expectedDispositionParcelle) {
        assertDispositionParcelleAllPropertiesEquals(
            expectedDispositionParcelle,
            getPersistedDispositionParcelle(expectedDispositionParcelle)
        );
    }

    protected void assertPersistedDispositionParcelleToMatchUpdatableProperties(DispositionParcelle expectedDispositionParcelle) {
        assertDispositionParcelleAllUpdatablePropertiesEquals(
            expectedDispositionParcelle,
            getPersistedDispositionParcelle(expectedDispositionParcelle)
        );
    }
}
