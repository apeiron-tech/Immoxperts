package com.apeiron.immoxperts.web.rest;

import static com.apeiron.immoxperts.domain.MutationAsserts.*;
import static com.apeiron.immoxperts.web.rest.TestUtil.createUpdateProxyForBean;
import static com.apeiron.immoxperts.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.apeiron.immoxperts.IntegrationTest;
import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.repository.MutationRepository;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import com.apeiron.immoxperts.service.mapper.MutationMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link MutationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MutationResourceIT {

    private static final Integer DEFAULT_IDMUTATION = 1;
    private static final Integer UPDATED_IDMUTATION = 2;

    private static final Instant DEFAULT_DATEMUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATEMUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final BigDecimal DEFAULT_VALEURFONC = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALEURFONC = new BigDecimal(2);

    private static final Integer DEFAULT_IDNATMUT = 1;
    private static final Integer UPDATED_IDNATMUT = 2;

    private static final String DEFAULT_CODDEP = "AAAAAAAAAA";
    private static final String UPDATED_CODDEP = "BBBBBBBBBB";

    private static final Boolean DEFAULT_VEFA = false;
    private static final Boolean UPDATED_VEFA = true;

    private static final BigDecimal DEFAULT_STERR = new BigDecimal(1);
    private static final BigDecimal UPDATED_STERR = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/mutations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MutationRepository mutationRepository;

    @Autowired
    private MutationMapper mutationMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMutationMockMvc;

    private Mutation mutation;

    private Mutation insertedMutation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mutation createEntity() {
        return new Mutation()
            .idmutation(DEFAULT_IDMUTATION)
            .datemut(DEFAULT_DATEMUT)
            .valeurfonc(DEFAULT_VALEURFONC)
            .idnatmut(DEFAULT_IDNATMUT)
            .coddep(DEFAULT_CODDEP)
            .vefa(DEFAULT_VEFA)
            .sterr(DEFAULT_STERR);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mutation createUpdatedEntity() {
        return new Mutation()
            .idmutation(UPDATED_IDMUTATION)
            .datemut(UPDATED_DATEMUT)
            .valeurfonc(UPDATED_VALEURFONC)
            .idnatmut(UPDATED_IDNATMUT)
            .coddep(UPDATED_CODDEP)
            .vefa(UPDATED_VEFA)
            .sterr(UPDATED_STERR);
    }

    @BeforeEach
    void initTest() {
        mutation = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedMutation != null) {
            mutationRepository.delete(insertedMutation);
            insertedMutation = null;
        }
    }

    @Test
    @Transactional
    void createMutation() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Mutation
        MutationDTO mutationDTO = mutationMapper.toDto(mutation);
        var returnedMutationDTO = om.readValue(
            restMutationMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(mutationDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            MutationDTO.class
        );

        // Validate the Mutation in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedMutation = mutationMapper.toEntity(returnedMutationDTO);
        assertMutationUpdatableFieldsEquals(returnedMutation, getPersistedMutation(returnedMutation));

        insertedMutation = returnedMutation;
    }

    @Test
    @Transactional
    void createMutationWithExistingId() throws Exception {
        // Create the Mutation with an existing ID
        mutation.setId(1L);
        MutationDTO mutationDTO = mutationMapper.toDto(mutation);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMutationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(mutationDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Mutation in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkIdmutationIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        mutation.setIdmutation(null);

        // Create the Mutation, which fails.
        MutationDTO mutationDTO = mutationMapper.toDto(mutation);

        restMutationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(mutationDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMutations() throws Exception {
        // Initialize the database
        insertedMutation = mutationRepository.saveAndFlush(mutation);

        // Get all the mutationList
        restMutationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mutation.getId().intValue())))
            .andExpect(jsonPath("$.[*].idmutation").value(hasItem(DEFAULT_IDMUTATION)))
            .andExpect(jsonPath("$.[*].datemut").value(hasItem(DEFAULT_DATEMUT.toString())))
            .andExpect(jsonPath("$.[*].valeurfonc").value(hasItem(sameNumber(DEFAULT_VALEURFONC))))
            .andExpect(jsonPath("$.[*].idnatmut").value(hasItem(DEFAULT_IDNATMUT)))
            .andExpect(jsonPath("$.[*].coddep").value(hasItem(DEFAULT_CODDEP)))
            .andExpect(jsonPath("$.[*].vefa").value(hasItem(DEFAULT_VEFA)))
            .andExpect(jsonPath("$.[*].sterr").value(hasItem(sameNumber(DEFAULT_STERR))));
    }

    @Test
    @Transactional
    void getMutation() throws Exception {
        // Initialize the database
        insertedMutation = mutationRepository.saveAndFlush(mutation);

        // Get the mutation
        restMutationMockMvc
            .perform(get(ENTITY_API_URL_ID, mutation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mutation.getId().intValue()))
            .andExpect(jsonPath("$.idmutation").value(DEFAULT_IDMUTATION))
            .andExpect(jsonPath("$.datemut").value(DEFAULT_DATEMUT.toString()))
            .andExpect(jsonPath("$.valeurfonc").value(sameNumber(DEFAULT_VALEURFONC)))
            .andExpect(jsonPath("$.idnatmut").value(DEFAULT_IDNATMUT))
            .andExpect(jsonPath("$.coddep").value(DEFAULT_CODDEP))
            .andExpect(jsonPath("$.vefa").value(DEFAULT_VEFA))
            .andExpect(jsonPath("$.sterr").value(sameNumber(DEFAULT_STERR)));
    }

    @Test
    @Transactional
    void getNonExistingMutation() throws Exception {
        // Get the mutation
        restMutationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMutation() throws Exception {
        // Initialize the database
        insertedMutation = mutationRepository.saveAndFlush(mutation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the mutation
        Mutation updatedMutation = mutationRepository.findById(mutation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMutation are not directly saved in db
        em.detach(updatedMutation);
        updatedMutation
            .idmutation(UPDATED_IDMUTATION)
            .datemut(UPDATED_DATEMUT)
            .valeurfonc(UPDATED_VALEURFONC)
            .idnatmut(UPDATED_IDNATMUT)
            .coddep(UPDATED_CODDEP)
            .vefa(UPDATED_VEFA)
            .sterr(UPDATED_STERR);
        MutationDTO mutationDTO = mutationMapper.toDto(updatedMutation);

        restMutationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mutationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(mutationDTO))
            )
            .andExpect(status().isOk());

        // Validate the Mutation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMutationToMatchAllProperties(updatedMutation);
    }

    @Test
    @Transactional
    void putNonExistingMutation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mutation.setId(longCount.incrementAndGet());

        // Create the Mutation
        MutationDTO mutationDTO = mutationMapper.toDto(mutation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMutationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, mutationDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(mutationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mutation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMutation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mutation.setId(longCount.incrementAndGet());

        // Create the Mutation
        MutationDTO mutationDTO = mutationMapper.toDto(mutation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMutationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(mutationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mutation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMutation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mutation.setId(longCount.incrementAndGet());

        // Create the Mutation
        MutationDTO mutationDTO = mutationMapper.toDto(mutation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMutationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(mutationDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mutation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMutationWithPatch() throws Exception {
        // Initialize the database
        insertedMutation = mutationRepository.saveAndFlush(mutation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the mutation using partial update
        Mutation partialUpdatedMutation = new Mutation();
        partialUpdatedMutation.setId(mutation.getId());

        partialUpdatedMutation.idmutation(UPDATED_IDMUTATION).vefa(UPDATED_VEFA).sterr(UPDATED_STERR);

        restMutationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMutation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMutation))
            )
            .andExpect(status().isOk());

        // Validate the Mutation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMutationUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedMutation, mutation), getPersistedMutation(mutation));
    }

    @Test
    @Transactional
    void fullUpdateMutationWithPatch() throws Exception {
        // Initialize the database
        insertedMutation = mutationRepository.saveAndFlush(mutation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the mutation using partial update
        Mutation partialUpdatedMutation = new Mutation();
        partialUpdatedMutation.setId(mutation.getId());

        partialUpdatedMutation
            .idmutation(UPDATED_IDMUTATION)
            .datemut(UPDATED_DATEMUT)
            .valeurfonc(UPDATED_VALEURFONC)
            .idnatmut(UPDATED_IDNATMUT)
            .coddep(UPDATED_CODDEP)
            .vefa(UPDATED_VEFA)
            .sterr(UPDATED_STERR);

        restMutationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMutation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMutation))
            )
            .andExpect(status().isOk());

        // Validate the Mutation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMutationUpdatableFieldsEquals(partialUpdatedMutation, getPersistedMutation(partialUpdatedMutation));
    }

    @Test
    @Transactional
    void patchNonExistingMutation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mutation.setId(longCount.incrementAndGet());

        // Create the Mutation
        MutationDTO mutationDTO = mutationMapper.toDto(mutation);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMutationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, mutationDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(mutationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mutation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMutation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mutation.setId(longCount.incrementAndGet());

        // Create the Mutation
        MutationDTO mutationDTO = mutationMapper.toDto(mutation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMutationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(mutationDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mutation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMutation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mutation.setId(longCount.incrementAndGet());

        // Create the Mutation
        MutationDTO mutationDTO = mutationMapper.toDto(mutation);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMutationMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(mutationDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mutation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMutation() throws Exception {
        // Initialize the database
        insertedMutation = mutationRepository.saveAndFlush(mutation);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the mutation
        restMutationMockMvc
            .perform(delete(ENTITY_API_URL_ID, mutation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return mutationRepository.count();
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

    protected Mutation getPersistedMutation(Mutation mutation) {
        return mutationRepository.findById(mutation.getId()).orElseThrow();
    }

    protected void assertPersistedMutationToMatchAllProperties(Mutation expectedMutation) {
        assertMutationAllPropertiesEquals(expectedMutation, getPersistedMutation(expectedMutation));
    }

    protected void assertPersistedMutationToMatchUpdatableProperties(Mutation expectedMutation) {
        assertMutationAllUpdatablePropertiesEquals(expectedMutation, getPersistedMutation(expectedMutation));
    }
}
