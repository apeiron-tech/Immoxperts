package com.apeiron.immoxperts.web.rest;

import static com.apeiron.immoxperts.domain.AdresseDispoparcAsserts.*;
import static com.apeiron.immoxperts.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.apeiron.immoxperts.IntegrationTest;
import com.apeiron.immoxperts.domain.AdresseDispoparc;
import com.apeiron.immoxperts.repository.AdresseDispoparcRepository;
import com.apeiron.immoxperts.service.dto.AdresseDispoparcDTO;
import com.apeiron.immoxperts.service.mapper.AdresseDispoparcMapper;
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
 * Integration tests for the {@link AdresseDispoparcResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdresseDispoparcResourceIT {

    private static final String ENTITY_API_URL = "/api/adresse-dispoparcs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AdresseDispoparcRepository adresseDispoparcRepository;

    @Autowired
    private AdresseDispoparcMapper adresseDispoparcMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdresseDispoparcMockMvc;

    private AdresseDispoparc adresseDispoparc;

    private AdresseDispoparc insertedAdresseDispoparc;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdresseDispoparc createEntity() {
        return new AdresseDispoparc();
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AdresseDispoparc createUpdatedEntity() {
        return new AdresseDispoparc();
    }

    @BeforeEach
    void initTest() {
        adresseDispoparc = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAdresseDispoparc != null) {
            adresseDispoparcRepository.delete(insertedAdresseDispoparc);
            insertedAdresseDispoparc = null;
        }
    }

    @Test
    @Transactional
    void createAdresseDispoparc() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the AdresseDispoparc
        AdresseDispoparcDTO adresseDispoparcDTO = adresseDispoparcMapper.toDto(adresseDispoparc);
        var returnedAdresseDispoparcDTO = om.readValue(
            restAdresseDispoparcMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseDispoparcDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AdresseDispoparcDTO.class
        );

        // Validate the AdresseDispoparc in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedAdresseDispoparc = adresseDispoparcMapper.toEntity(returnedAdresseDispoparcDTO);
        assertAdresseDispoparcUpdatableFieldsEquals(returnedAdresseDispoparc, getPersistedAdresseDispoparc(returnedAdresseDispoparc));

        insertedAdresseDispoparc = returnedAdresseDispoparc;
    }

    @Test
    @Transactional
    void createAdresseDispoparcWithExistingId() throws Exception {
        // Create the AdresseDispoparc with an existing ID
        adresseDispoparc.setId(1);
        AdresseDispoparcDTO adresseDispoparcDTO = adresseDispoparcMapper.toDto(adresseDispoparc);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdresseDispoparcMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseDispoparcDTO)))
            .andExpect(status().isBadRequest());

        // Validate the AdresseDispoparc in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAdresseDispoparcs() throws Exception {
        // Initialize the database
        insertedAdresseDispoparc = adresseDispoparcRepository.saveAndFlush(adresseDispoparc);

        // Get all the adresseDispoparcList
        restAdresseDispoparcMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(adresseDispoparc.getId().intValue())));
    }

    @Test
    @Transactional
    void getAdresseDispoparc() throws Exception {
        // Initialize the database
        insertedAdresseDispoparc = adresseDispoparcRepository.saveAndFlush(adresseDispoparc);

        // Get the adresseDispoparc
        restAdresseDispoparcMockMvc
            .perform(get(ENTITY_API_URL_ID, adresseDispoparc.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(adresseDispoparc.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAdresseDispoparc() throws Exception {
        // Get the adresseDispoparc
        restAdresseDispoparcMockMvc.perform(get(ENTITY_API_URL_ID, Integer.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAdresseDispoparc() throws Exception {
        // Initialize the database
        insertedAdresseDispoparc = adresseDispoparcRepository.saveAndFlush(adresseDispoparc);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adresseDispoparc
        AdresseDispoparc updatedAdresseDispoparc = adresseDispoparcRepository.findById(adresseDispoparc.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAdresseDispoparc are not directly saved in db
        em.detach(updatedAdresseDispoparc);
        AdresseDispoparcDTO adresseDispoparcDTO = adresseDispoparcMapper.toDto(updatedAdresseDispoparc);

        restAdresseDispoparcMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adresseDispoparcDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(adresseDispoparcDTO))
            )
            .andExpect(status().isOk());

        // Validate the AdresseDispoparc in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAdresseDispoparcToMatchAllProperties(updatedAdresseDispoparc);
    }

    @Test
    @Transactional
    void putNonExistingAdresseDispoparc() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseDispoparc.setId(intCount.incrementAndGet());

        // Create the AdresseDispoparc
        AdresseDispoparcDTO adresseDispoparcDTO = adresseDispoparcMapper.toDto(adresseDispoparc);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdresseDispoparcMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adresseDispoparcDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(adresseDispoparcDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdresseDispoparc in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdresseDispoparc() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseDispoparc.setId(intCount.incrementAndGet());

        // Create the AdresseDispoparc
        AdresseDispoparcDTO adresseDispoparcDTO = adresseDispoparcMapper.toDto(adresseDispoparc);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseDispoparcMockMvc
            .perform(
                put(ENTITY_API_URL_ID, intCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(adresseDispoparcDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdresseDispoparc in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdresseDispoparc() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseDispoparc.setId(intCount.incrementAndGet());

        // Create the AdresseDispoparc
        AdresseDispoparcDTO adresseDispoparcDTO = adresseDispoparcMapper.toDto(adresseDispoparc);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseDispoparcMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseDispoparcDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdresseDispoparc in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdresseDispoparcWithPatch() throws Exception {
        // Initialize the database
        insertedAdresseDispoparc = adresseDispoparcRepository.saveAndFlush(adresseDispoparc);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adresseDispoparc using partial update
        AdresseDispoparc partialUpdatedAdresseDispoparc = new AdresseDispoparc();
        partialUpdatedAdresseDispoparc.setId(adresseDispoparc.getId());

        restAdresseDispoparcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdresseDispoparc.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAdresseDispoparc))
            )
            .andExpect(status().isOk());

        // Validate the AdresseDispoparc in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAdresseDispoparcUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedAdresseDispoparc, adresseDispoparc),
            getPersistedAdresseDispoparc(adresseDispoparc)
        );
    }

    @Test
    @Transactional
    void fullUpdateAdresseDispoparcWithPatch() throws Exception {
        // Initialize the database
        insertedAdresseDispoparc = adresseDispoparcRepository.saveAndFlush(adresseDispoparc);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adresseDispoparc using partial update
        AdresseDispoparc partialUpdatedAdresseDispoparc = new AdresseDispoparc();
        partialUpdatedAdresseDispoparc.setId(adresseDispoparc.getId());

        restAdresseDispoparcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdresseDispoparc.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAdresseDispoparc))
            )
            .andExpect(status().isOk());

        // Validate the AdresseDispoparc in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAdresseDispoparcUpdatableFieldsEquals(
            partialUpdatedAdresseDispoparc,
            getPersistedAdresseDispoparc(partialUpdatedAdresseDispoparc)
        );
    }

    @Test
    @Transactional
    void patchNonExistingAdresseDispoparc() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseDispoparc.setId(intCount.incrementAndGet());

        // Create the AdresseDispoparc
        AdresseDispoparcDTO adresseDispoparcDTO = adresseDispoparcMapper.toDto(adresseDispoparc);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdresseDispoparcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, adresseDispoparcDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(adresseDispoparcDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdresseDispoparc in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdresseDispoparc() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseDispoparc.setId(intCount.incrementAndGet());

        // Create the AdresseDispoparc
        AdresseDispoparcDTO adresseDispoparcDTO = adresseDispoparcMapper.toDto(adresseDispoparc);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseDispoparcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, intCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(adresseDispoparcDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the AdresseDispoparc in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdresseDispoparc() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresseDispoparc.setId(intCount.incrementAndGet());

        // Create the AdresseDispoparc
        AdresseDispoparcDTO adresseDispoparcDTO = adresseDispoparcMapper.toDto(adresseDispoparc);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseDispoparcMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(adresseDispoparcDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AdresseDispoparc in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdresseDispoparc() throws Exception {
        // Initialize the database
        insertedAdresseDispoparc = adresseDispoparcRepository.saveAndFlush(adresseDispoparc);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the adresseDispoparc
        restAdresseDispoparcMockMvc
            .perform(delete(ENTITY_API_URL_ID, adresseDispoparc.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return adresseDispoparcRepository.count();
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

    protected AdresseDispoparc getPersistedAdresseDispoparc(AdresseDispoparc adresseDispoparc) {
        return adresseDispoparcRepository.findById(adresseDispoparc.getId()).orElseThrow();
    }

    protected void assertPersistedAdresseDispoparcToMatchAllProperties(AdresseDispoparc expectedAdresseDispoparc) {
        assertAdresseDispoparcAllPropertiesEquals(expectedAdresseDispoparc, getPersistedAdresseDispoparc(expectedAdresseDispoparc));
    }

    protected void assertPersistedAdresseDispoparcToMatchUpdatableProperties(AdresseDispoparc expectedAdresseDispoparc) {
        assertAdresseDispoparcAllUpdatablePropertiesEquals(
            expectedAdresseDispoparc,
            getPersistedAdresseDispoparc(expectedAdresseDispoparc)
        );
    }
}
