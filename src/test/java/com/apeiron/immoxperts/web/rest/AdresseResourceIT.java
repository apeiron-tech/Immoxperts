package com.apeiron.immoxperts.web.rest;

import static com.apeiron.immoxperts.domain.AdresseAsserts.*;
import static com.apeiron.immoxperts.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.apeiron.immoxperts.IntegrationTest;
import com.apeiron.immoxperts.domain.Adresse;
import com.apeiron.immoxperts.repository.AdresseRepository;
import com.apeiron.immoxperts.service.dto.AdresseDTO;
import com.apeiron.immoxperts.service.mapper.AdresseMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link AdresseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AdresseResourceIT {

    private static final Integer DEFAULT_IDADRESSE = 1;
    private static final Integer UPDATED_IDADRESSE = 2;

    private static final Integer DEFAULT_NOVOIE = 1;
    private static final Integer UPDATED_NOVOIE = 2;

    private static final String DEFAULT_BTQ = "AAAAAAAAAA";
    private static final String UPDATED_BTQ = "BBBBBBBBBB";

    private static final String DEFAULT_TYPVOIE = "AAAAAAAAAA";
    private static final String UPDATED_TYPVOIE = "BBBBBBBBBB";

    private static final String DEFAULT_CODVOIE = "AAAAAAAAAA";
    private static final String UPDATED_CODVOIE = "BBBBBBBBBB";

    private static final String DEFAULT_VOIE = "AAAAAAAAAA";
    private static final String UPDATED_VOIE = "BBBBBBBBBB";

    private static final String DEFAULT_CODEPOSTAL = "AAAAAAAAAA";
    private static final String UPDATED_CODEPOSTAL = "BBBBBBBBBB";

    private static final String DEFAULT_COMMUNE = "AAAAAAAAAA";
    private static final String UPDATED_COMMUNE = "BBBBBBBBBB";

    private static final String DEFAULT_CODDEP = "AAAAAAAAAA";
    private static final String UPDATED_CODDEP = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/adresses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AdresseRepository adresseRepository;

    @Autowired
    private AdresseMapper adresseMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAdresseMockMvc;

    private Adresse adresse;

    private Adresse insertedAdresse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Adresse createEntity() {
        return new Adresse()
            .idadresse(DEFAULT_IDADRESSE)
            .novoie(DEFAULT_NOVOIE)
            .btq(DEFAULT_BTQ)
            .typvoie(DEFAULT_TYPVOIE)
            .codvoie(DEFAULT_CODVOIE)
            .voie(DEFAULT_VOIE)
            .codepostal(DEFAULT_CODEPOSTAL)
            .commune(DEFAULT_COMMUNE)
            .coddep(DEFAULT_CODDEP);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Adresse createUpdatedEntity() {
        return new Adresse()
            .idadresse(UPDATED_IDADRESSE)
            .novoie(UPDATED_NOVOIE)
            .btq(UPDATED_BTQ)
            .typvoie(UPDATED_TYPVOIE)
            .codvoie(UPDATED_CODVOIE)
            .voie(UPDATED_VOIE)
            .codepostal(UPDATED_CODEPOSTAL)
            .commune(UPDATED_COMMUNE)
            .coddep(UPDATED_CODDEP);
    }

    @BeforeEach
    void initTest() {
        adresse = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedAdresse != null) {
            adresseRepository.delete(insertedAdresse);
            insertedAdresse = null;
        }
    }

    @Test
    @Transactional
    void createAdresse() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Adresse
        AdresseDTO adresseDTO = adresseMapper.toDto(adresse);
        var returnedAdresseDTO = om.readValue(
            restAdresseMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AdresseDTO.class
        );

        // Validate the Adresse in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedAdresse = adresseMapper.toEntity(returnedAdresseDTO);
        assertAdresseUpdatableFieldsEquals(returnedAdresse, getPersistedAdresse(returnedAdresse));

        insertedAdresse = returnedAdresse;
    }

    @Test
    @Transactional
    void createAdresseWithExistingId() throws Exception {
        // Create the Adresse with an existing ID
        adresse.setId(1L);
        AdresseDTO adresseDTO = adresseMapper.toDto(adresse);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdresseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkIdadresseIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        adresse.setIdadresse(null);

        // Create the Adresse, which fails.
        AdresseDTO adresseDTO = adresseMapper.toDto(adresse);

        restAdresseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAdresses() throws Exception {
        // Initialize the database
        insertedAdresse = adresseRepository.saveAndFlush(adresse);

        // Get all the adresseList
        restAdresseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(adresse.getId().intValue())))
            .andExpect(jsonPath("$.[*].idadresse").value(hasItem(DEFAULT_IDADRESSE)))
            .andExpect(jsonPath("$.[*].novoie").value(hasItem(DEFAULT_NOVOIE)))
            .andExpect(jsonPath("$.[*].btq").value(hasItem(DEFAULT_BTQ)))
            .andExpect(jsonPath("$.[*].typvoie").value(hasItem(DEFAULT_TYPVOIE)))
            .andExpect(jsonPath("$.[*].codvoie").value(hasItem(DEFAULT_CODVOIE)))
            .andExpect(jsonPath("$.[*].voie").value(hasItem(DEFAULT_VOIE)))
            .andExpect(jsonPath("$.[*].codepostal").value(hasItem(DEFAULT_CODEPOSTAL)))
            .andExpect(jsonPath("$.[*].commune").value(hasItem(DEFAULT_COMMUNE)))
            .andExpect(jsonPath("$.[*].coddep").value(hasItem(DEFAULT_CODDEP)));
    }

    @Test
    @Transactional
    void getAdresse() throws Exception {
        // Initialize the database
        insertedAdresse = adresseRepository.saveAndFlush(adresse);

        // Get the adresse
        restAdresseMockMvc
            .perform(get(ENTITY_API_URL_ID, adresse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(adresse.getId().intValue()))
            .andExpect(jsonPath("$.idadresse").value(DEFAULT_IDADRESSE))
            .andExpect(jsonPath("$.novoie").value(DEFAULT_NOVOIE))
            .andExpect(jsonPath("$.btq").value(DEFAULT_BTQ))
            .andExpect(jsonPath("$.typvoie").value(DEFAULT_TYPVOIE))
            .andExpect(jsonPath("$.codvoie").value(DEFAULT_CODVOIE))
            .andExpect(jsonPath("$.voie").value(DEFAULT_VOIE))
            .andExpect(jsonPath("$.codepostal").value(DEFAULT_CODEPOSTAL))
            .andExpect(jsonPath("$.commune").value(DEFAULT_COMMUNE))
            .andExpect(jsonPath("$.coddep").value(DEFAULT_CODDEP));
    }

    @Test
    @Transactional
    void getNonExistingAdresse() throws Exception {
        // Get the adresse
        restAdresseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAdresse() throws Exception {
        // Initialize the database
        insertedAdresse = adresseRepository.saveAndFlush(adresse);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adresse
        Adresse updatedAdresse = adresseRepository.findById(adresse.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAdresse are not directly saved in db
        em.detach(updatedAdresse);
        updatedAdresse
            .idadresse(UPDATED_IDADRESSE)
            .novoie(UPDATED_NOVOIE)
            .btq(UPDATED_BTQ)
            .typvoie(UPDATED_TYPVOIE)
            .codvoie(UPDATED_CODVOIE)
            .voie(UPDATED_VOIE)
            .codepostal(UPDATED_CODEPOSTAL)
            .commune(UPDATED_COMMUNE)
            .coddep(UPDATED_CODDEP);
        AdresseDTO adresseDTO = adresseMapper.toDto(updatedAdresse);

        restAdresseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adresseDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseDTO))
            )
            .andExpect(status().isOk());

        // Validate the Adresse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAdresseToMatchAllProperties(updatedAdresse);
    }

    @Test
    @Transactional
    void putNonExistingAdresse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresse.setId(longCount.incrementAndGet());

        // Create the Adresse
        AdresseDTO adresseDTO = adresseMapper.toDto(adresse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, adresseDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAdresse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresse.setId(longCount.incrementAndGet());

        // Create the Adresse
        AdresseDTO adresseDTO = adresseMapper.toDto(adresse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(adresseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAdresse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresse.setId(longCount.incrementAndGet());

        // Create the Adresse
        AdresseDTO adresseDTO = adresseMapper.toDto(adresse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(adresseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Adresse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAdresseWithPatch() throws Exception {
        // Initialize the database
        insertedAdresse = adresseRepository.saveAndFlush(adresse);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adresse using partial update
        Adresse partialUpdatedAdresse = new Adresse();
        partialUpdatedAdresse.setId(adresse.getId());

        partialUpdatedAdresse
            .novoie(UPDATED_NOVOIE)
            .typvoie(UPDATED_TYPVOIE)
            .codvoie(UPDATED_CODVOIE)
            .voie(UPDATED_VOIE)
            .codepostal(UPDATED_CODEPOSTAL)
            .commune(UPDATED_COMMUNE)
            .coddep(UPDATED_CODDEP);

        restAdresseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdresse.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAdresse))
            )
            .andExpect(status().isOk());

        // Validate the Adresse in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAdresseUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAdresse, adresse), getPersistedAdresse(adresse));
    }

    @Test
    @Transactional
    void fullUpdateAdresseWithPatch() throws Exception {
        // Initialize the database
        insertedAdresse = adresseRepository.saveAndFlush(adresse);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the adresse using partial update
        Adresse partialUpdatedAdresse = new Adresse();
        partialUpdatedAdresse.setId(adresse.getId());

        partialUpdatedAdresse
            .idadresse(UPDATED_IDADRESSE)
            .novoie(UPDATED_NOVOIE)
            .btq(UPDATED_BTQ)
            .typvoie(UPDATED_TYPVOIE)
            .codvoie(UPDATED_CODVOIE)
            .voie(UPDATED_VOIE)
            .codepostal(UPDATED_CODEPOSTAL)
            .commune(UPDATED_COMMUNE)
            .coddep(UPDATED_CODDEP);

        restAdresseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAdresse.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAdresse))
            )
            .andExpect(status().isOk());

        // Validate the Adresse in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAdresseUpdatableFieldsEquals(partialUpdatedAdresse, getPersistedAdresse(partialUpdatedAdresse));
    }

    @Test
    @Transactional
    void patchNonExistingAdresse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresse.setId(longCount.incrementAndGet());

        // Create the Adresse
        AdresseDTO adresseDTO = adresseMapper.toDto(adresse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, adresseDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(adresseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAdresse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresse.setId(longCount.incrementAndGet());

        // Create the Adresse
        AdresseDTO adresseDTO = adresseMapper.toDto(adresse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(adresseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Adresse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAdresse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        adresse.setId(longCount.incrementAndGet());

        // Create the Adresse
        AdresseDTO adresseDTO = adresseMapper.toDto(adresse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAdresseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(adresseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Adresse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAdresse() throws Exception {
        // Initialize the database
        insertedAdresse = adresseRepository.saveAndFlush(adresse);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the adresse
        restAdresseMockMvc
            .perform(delete(ENTITY_API_URL_ID, adresse.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return adresseRepository.count();
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

    protected Adresse getPersistedAdresse(Adresse adresse) {
        return adresseRepository.findById(adresse.getId()).orElseThrow();
    }

    protected void assertPersistedAdresseToMatchAllProperties(Adresse expectedAdresse) {
        assertAdresseAllPropertiesEquals(expectedAdresse, getPersistedAdresse(expectedAdresse));
    }

    protected void assertPersistedAdresseToMatchUpdatableProperties(Adresse expectedAdresse) {
        assertAdresseAllUpdatablePropertiesEquals(expectedAdresse, getPersistedAdresse(expectedAdresse));
    }
}
