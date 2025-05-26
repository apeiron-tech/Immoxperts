package com.apeiron.immoxperts.web.rest;

import static com.apeiron.immoxperts.domain.LotAsserts.*;
import static com.apeiron.immoxperts.web.rest.TestUtil.createUpdateProxyForBean;
import static com.apeiron.immoxperts.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.apeiron.immoxperts.IntegrationTest;
import com.apeiron.immoxperts.domain.Lot;
import com.apeiron.immoxperts.repository.LotRepository;
import com.apeiron.immoxperts.service.dto.LotDTO;
import com.apeiron.immoxperts.service.mapper.LotMapper;
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
 * Integration tests for the {@link LotResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LotResourceIT {

    private static final Integer DEFAULT_IDDISPOLOT = 1;
    private static final Integer UPDATED_IDDISPOLOT = 2;

    private static final BigDecimal DEFAULT_SCARREZ = new BigDecimal(1);
    private static final BigDecimal UPDATED_SCARREZ = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/lots";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LotRepository lotRepository;

    @Autowired
    private LotMapper lotMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLotMockMvc;

    private Lot lot;

    private Lot insertedLot;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lot createEntity() {
        return new Lot().iddispolot(DEFAULT_IDDISPOLOT).scarrez(DEFAULT_SCARREZ);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lot createUpdatedEntity() {
        return new Lot().iddispolot(UPDATED_IDDISPOLOT).scarrez(UPDATED_SCARREZ);
    }

    @BeforeEach
    void initTest() {
        lot = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedLot != null) {
            lotRepository.delete(insertedLot);
            insertedLot = null;
        }
    }

    @Test
    @Transactional
    void createLot() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Lot
        LotDTO lotDTO = lotMapper.toDto(lot);
        var returnedLotDTO = om.readValue(
            restLotMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            LotDTO.class
        );

        // Validate the Lot in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedLot = lotMapper.toEntity(returnedLotDTO);
        assertLotUpdatableFieldsEquals(returnedLot, getPersistedLot(returnedLot));

        insertedLot = returnedLot;
    }

    @Test
    @Transactional
    void createLotWithExistingId() throws Exception {
        // Create the Lot with an existing ID
        lot.setId(1L);
        LotDTO lotDTO = lotMapper.toDto(lot);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLotMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Lot in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkIddispolotIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        lot.setIddispolot(null);

        // Create the Lot, which fails.
        LotDTO lotDTO = lotMapper.toDto(lot);

        restLotMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLots() throws Exception {
        // Initialize the database
        insertedLot = lotRepository.saveAndFlush(lot);

        // Get all the lotList
        restLotMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lot.getId().intValue())))
            .andExpect(jsonPath("$.[*].iddispolot").value(hasItem(DEFAULT_IDDISPOLOT)))
            .andExpect(jsonPath("$.[*].scarrez").value(hasItem(sameNumber(DEFAULT_SCARREZ))));
    }

    @Test
    @Transactional
    void getLot() throws Exception {
        // Initialize the database
        insertedLot = lotRepository.saveAndFlush(lot);

        // Get the lot
        restLotMockMvc
            .perform(get(ENTITY_API_URL_ID, lot.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lot.getId().intValue()))
            .andExpect(jsonPath("$.iddispolot").value(DEFAULT_IDDISPOLOT))
            .andExpect(jsonPath("$.scarrez").value(sameNumber(DEFAULT_SCARREZ)));
    }

    @Test
    @Transactional
    void getNonExistingLot() throws Exception {
        // Get the lot
        restLotMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLot() throws Exception {
        // Initialize the database
        insertedLot = lotRepository.saveAndFlush(lot);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the lot
        Lot updatedLot = lotRepository.findById(lot.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLot are not directly saved in db
        em.detach(updatedLot);
        updatedLot.iddispolot(UPDATED_IDDISPOLOT).scarrez(UPDATED_SCARREZ);
        LotDTO lotDTO = lotMapper.toDto(updatedLot);

        restLotMockMvc
            .perform(put(ENTITY_API_URL_ID, lotDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotDTO)))
            .andExpect(status().isOk());

        // Validate the Lot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLotToMatchAllProperties(updatedLot);
    }

    @Test
    @Transactional
    void putNonExistingLot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lot.setId(longCount.incrementAndGet());

        // Create the Lot
        LotDTO lotDTO = lotMapper.toDto(lot);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLotMockMvc
            .perform(put(ENTITY_API_URL_ID, lotDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Lot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lot.setId(longCount.incrementAndGet());

        // Create the Lot
        LotDTO lotDTO = lotMapper.toDto(lot);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(lotDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lot.setId(longCount.incrementAndGet());

        // Create the Lot
        LotDTO lotDTO = lotMapper.toDto(lot);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLotMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lotDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLotWithPatch() throws Exception {
        // Initialize the database
        insertedLot = lotRepository.saveAndFlush(lot);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the lot using partial update
        Lot partialUpdatedLot = new Lot();
        partialUpdatedLot.setId(lot.getId());

        partialUpdatedLot.iddispolot(UPDATED_IDDISPOLOT);

        restLotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLot.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLot))
            )
            .andExpect(status().isOk());

        // Validate the Lot in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLotUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedLot, lot), getPersistedLot(lot));
    }

    @Test
    @Transactional
    void fullUpdateLotWithPatch() throws Exception {
        // Initialize the database
        insertedLot = lotRepository.saveAndFlush(lot);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the lot using partial update
        Lot partialUpdatedLot = new Lot();
        partialUpdatedLot.setId(lot.getId());

        partialUpdatedLot.iddispolot(UPDATED_IDDISPOLOT).scarrez(UPDATED_SCARREZ);

        restLotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLot.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLot))
            )
            .andExpect(status().isOk());

        // Validate the Lot in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLotUpdatableFieldsEquals(partialUpdatedLot, getPersistedLot(partialUpdatedLot));
    }

    @Test
    @Transactional
    void patchNonExistingLot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lot.setId(longCount.incrementAndGet());

        // Create the Lot
        LotDTO lotDTO = lotMapper.toDto(lot);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lotDTO.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(lotDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lot.setId(longCount.incrementAndGet());

        // Create the Lot
        LotDTO lotDTO = lotMapper.toDto(lot);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(lotDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLot() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lot.setId(longCount.incrementAndGet());

        // Create the Lot
        LotDTO lotDTO = lotMapper.toDto(lot);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLotMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(lotDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lot in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLot() throws Exception {
        // Initialize the database
        insertedLot = lotRepository.saveAndFlush(lot);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the lot
        restLotMockMvc.perform(delete(ENTITY_API_URL_ID, lot.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return lotRepository.count();
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

    protected Lot getPersistedLot(Lot lot) {
        return lotRepository.findById(lot.getId()).orElseThrow();
    }

    protected void assertPersistedLotToMatchAllProperties(Lot expectedLot) {
        assertLotAllPropertiesEquals(expectedLot, getPersistedLot(expectedLot));
    }

    protected void assertPersistedLotToMatchUpdatableProperties(Lot expectedLot) {
        assertLotAllUpdatablePropertiesEquals(expectedLot, getPersistedLot(expectedLot));
    }
}
