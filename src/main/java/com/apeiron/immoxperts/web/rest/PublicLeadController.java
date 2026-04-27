package com.apeiron.immoxperts.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints publics de capture de lead — V1 freemium.
 *
 * Persistance : à brancher sur la table leads dans une PR dédiée (entité, repo, service).
 * Pour l'instant on log et on renvoie 201 — l'objectif est d'avoir le contrat HTTP stable côté front.
 */
@RestController
@RequestMapping("/api/public")
public class PublicLeadController {

    private static final Logger LOG = LoggerFactory.getLogger(PublicLeadController.class);

    @PostMapping("/estimation/lead")
    public ResponseEntity<?> estimationLead(@Valid @RequestBody EstimationLeadVM body) {
        String leadId = UUID.randomUUID().toString();
        LOG.info(
            "[lead public_estimation] id={} email={} estimationId={}",
            leadId,
            body.email,
            body.estimationId
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true, "leadId", leadId));
    }

    @PostMapping("/invest/lead")
    public ResponseEntity<?> investLead(@Valid @RequestBody InvestLeadVM body) {
        String leadId = UUID.randomUUID().toString();
        LOG.info(
            "[lead public_simulateur_invest] id={} email={} prix={} loyer={}",
            leadId,
            body.email,
            body.simulationState != null ? body.simulationState.get("prix") : null,
            body.simulationState != null ? body.simulationState.get("loyerMensuel") : null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("ok", true, "leadId", leadId));
    }

    public static class EstimationLeadVM {

        public String estimationId;

        @NotBlank
        public String firstName;

        @NotBlank
        public String lastName;

        @NotBlank
        @Email
        public String email;

        public String phone;

        @AssertTrue(message = "consent must be true")
        public boolean consent;
    }

    public static class InvestLeadVM {

        @NotBlank
        public String firstName;

        @NotBlank
        public String lastName;

        @NotBlank
        @Email
        public String email;

        public String phone;

        @AssertTrue(message = "consent must be true")
        public boolean consent;

        public Map<String, Object> simulationState;
        public Map<String, Object> simulationResult;
    }
}
