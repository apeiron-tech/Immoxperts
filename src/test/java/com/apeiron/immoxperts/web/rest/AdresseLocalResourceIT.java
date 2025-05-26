package com.apeiron.immoxperts.web.rest;

import static com.apeiron.immoxperts.domain.AdresseLocalAsserts.*;
import static com.apeiron.immoxperts.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.apeiron.immoxperts.IntegrationTest;
import com.apeiron.immoxperts.domain.AdresseLocal;
import com.apeiron.immoxperts.repository.AdresseLocalRepository;
import com.apeiron.immoxperts.service.dto.AdresseLocalDTO;
import com.apeiron.immoxperts.service.mapper.AdresseLocalMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
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
 * Integration tests for the {@link AdresseLocalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdresseLocalResourceIT {

    private static final String DEFAULT_CODDEP = "AAAAAAAAAA";
    private static final String UPDATED_CODDEP = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/adresse-locals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AdresseLocalRepository adresseLocalRepository;

    @Autowired
    private AdresseLocalMapper adresseLocalMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdresseLocalMockMvc;

    private AdresseLocal adresseLocal;

    private AdresseLocal insertedAdresseLocal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdresseLocal createEntity() {
        return new AdresseLocal().coddep(DEFAULT_CODDEP);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdresseLocal createUpdatedEntity() {
        return new AdresseLocal().coddep(UPDATED_CODDEP);
    }

    @BeforeEach
    void initTest() {
        adresseLocal = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAdresseLocal != null) {
            adresseLocalRepository.delete(insertedAdresseLocal);
            insertedAdresseLocal = null;
        }
    }

    @Test
    @Transactional
    void createAdresseLocal() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AdresseLocal
        AdresseLocalDTO adresseLocalDTO = adresseLocalMapper.toDto(adresseLocal);
        var returnedAdresseLocalDTO = om.readValue(
            restAdresseLocalMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseLocalDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AdresseLocalDTO.class
        );

        // Validate the AdresseLocal in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedAdresseLocal = adresseLocalMapper.toEntity(returnedAdresseLocalDTO);
        assertAdresseLocalUpdatableFieldsEquals(returnedAdresseLocal, getPersistedAdresseLocal(returnedAdresseLocal));

        insertedAdresseLocal = returnedAdresseLocal;
    }

    @Test
    @Transactional
    void createAdresseLocalWithExistingId() throws Exception {
        // Create the AdresseLocal with an existing ID
        adresseLocal.setId(1);
        AdresseLocalDTO adresseLocalDTO = adresseLocalMapper.toDto(adresseLocal);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdresseLocalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseLocalDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AdresseLocal in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAdresseLocals() throws Exception {
        // Initialize the database
        insertedAdresseLocal = adresseLocalRepository.saveAndFlush(adresseLocal);

        // Get all the adresseLocalList
        restAdresseLocalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(adresseLocal.getId().intValue())))
            .andExpect(jsonPath("$.[*].coddep").value(hasItem(DEFAULT_CODDEP)));
    }

    @Test
    @Transactional
    void getAdresseLocal() throws Exception {
        // Initialize the database
        insertedAdresseLocal = adresseLocalRepository.saveAndFlush(adresseLocal);

        // Get the adresseLocal
        restAdresseLocalMockMvc
            .perform(get(ENTITY_API_URL_ID, adresseLocal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(adresseLocal.getId().intValue()))
            .andExpect(jsonPath("$.coddep").value(DEFAULT_CODDEP));
    }

    @Test
    @Transactional
    void getNonExistingAdresseLocal() throws Exception {
        // Get the adresseLocal
        restAdresseLocalMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAdresseLocal() throws Exception {
        // Initialize the database
        insertedAdresseLocal = adresseLocalRepository.saveAndFlush(adresseLocal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adresseLocal
        AdresseLocal updatedAdresseLocal = adresseLocalRepository.findById(adresseLocal.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAdresseLocal are not directly saved in db
        em.detach(updatedAdresseLocal);
        updatedAdresseLocal.coddep(UPDATED_CODDEP);
        AdresseLocalDTO adresseLocalDTO = adresseLocalMapper.toDto(updatedAdresseLocal);

        restAdresseLocalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adresseLocalDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(adresseLocalDTO))
            )
            .andExpect(status().isOk());

        // Validate the AdresseLocal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAdresseLocalToMatchAllProperties(updatedAdresseLocal);
    }

    @Test
    @Transactional
    void putNonExistingAdresseLocal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseLocal.setId(intCount.incrementAndGet());

        // Create the AdresseLocal
        AdresseLocalDTO adresseLocalDTO = adresseLocalMapper.toDto(adresseLocal);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdresseLocalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adresseLocalDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(adresseLocalDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdresseLocal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdresseLocal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseLocal.setId(intCount.incrementAndGet());

        // Create the AdresseLocal
        AdresseLocalDTO adresseLocalDTO = adresseLocalMapper.toDto(adresseLocal);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseLocalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, intCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(adresseLocalDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdresseLocal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdresseLocal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseLocal.setId(intCount.incrementAndGet());

        // Create the AdresseLocal
        AdresseLocalDTO adresseLocalDTO = adresseLocalMapper.toDto(adresseLocal);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseLocalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseLocalDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdresseLocal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdresseLocalWithPatch() throws Exception {
        // Initialize the database
        insertedAdresseLocal = adresseLocalRepository.saveAndFlush(adresseLocal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adresseLocal using partial update
        AdresseLocal partialUpdatedAdresseLocal = new AdresseLocal();
        partialUpdatedAdresseLocal.setId(adresseLocal.getId());

        restAdresseLocalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdresseLocal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAdresseLocal))
            )
            .andExpect(status().isOk());

        // Validate the AdresseLocal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAdresseLocalUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAdresseLocal, adresseLocal),
            getPersistedAdresseLocal(adresseLocal)
        );
    }

    @Test
    @Transactional
    void fullUpdateAdresseLocalWithPatch() throws Exception {
        // Initialize the database
        insertedAdresseLocal = adresseLocalRepository.saveAndFlush(adresseLocal);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adresseLocal using partial update
        AdresseLocal partialUpdatedAdresseLocal = new AdresseLocal();
        partialUpdatedAdresseLocal.setId(adresseLocal.getId());

        partialUpdatedAdresseLocal.coddep(UPDATED_CODDEP);

        restAdresseLocalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdresseLocal.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAdresseLocal))
            )
            .andExpect(status().isOk());

        // Validate the AdresseLocal in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAdresseLocalUpdatableFieldsEquals(partialUpdatedAdresseLocal, getPersistedAdresseLocal(partialUpdatedAdresseLocal));
    }

    @Test
    @Transactional
    void patchNonExistingAdresseLocal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseLocal.setId(intCount.incrementAndGet());

        // Create the AdresseLocal
        AdresseLocalDTO adresseLocalDTO = adresseLocalMapper.toDto(adresseLocal);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdresseLocalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, adresseLocalDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(adresseLocalDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdresseLocal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdresseLocal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseLocal.setId(intCount.incrementAndGet());

        // Create the AdresseLocal
        AdresseLocalDTO adresseLocalDTO = adresseLocalMapper.toDto(adresseLocal);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseLocalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, intCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(adresseLocalDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdresseLocal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdresseLocal() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseLocal.setId(intCount.incrementAndGet());

        // Create the AdresseLocal
        AdresseLocalDTO adresseLocalDTO = adresseLocalMapper.toDto(adresseLocal);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseLocalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(adresseLocalDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdresseLocal in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdresseLocal() throws Exception {
        // Initialize the database
        insertedAdresseLocal = adresseLocalRepository.saveAndFlush(adresseLocal);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the adresseLocal
        restAdresseLocalMockMvc
            .perform(delete(ENTITY_API_URL_ID, adresseLocal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return adresseLocalRepository.count();
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

    protected AdresseLocal getPersistedAdresseLocal(AdresseLocal adresseLocal) {
        return adresseLocalRepository.findById(adresseLocal.getId()).orElseThrow();
    }

    protected void assertPersistedAdresseLocalToMatchAllProperties(AdresseLocal expectedAdresseLocal) {
        assertAdresseLocalAllPropertiesEquals(expectedAdresseLocal, getPersistedAdresseLocal(expectedAdresseLocal));
    }

    protected void assertPersistedAdresseLocalToMatchUpdatableProperties(AdresseLocal expectedAdresseLocal) {
        assertAdresseLocalAllUpdatablePropertiesEquals(expectedAdresseLocal, getPersistedAdresseLocal(expectedAdresseLocal));
    }
}
