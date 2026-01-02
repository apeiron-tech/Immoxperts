package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.service.MailService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactResource {

    private static final Logger LOG = LoggerFactory.getLogger(ContactResource.class);

    private final MailService mailService;

    public ContactResource(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody ContactRequest request) {
        LOG.info("REST request to subscribe email: {}", request != null && request.getEmail() != null ? request.getEmail() : "null");

        if (request == null || request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            LOG.warn("Invalid request: email is null or empty");
            return ResponseEntity.badRequest().body("{\"error\":\"Email is required\"}");
        }

        try {
            String subject = "Nouvelle inscription - Propsight se construit avec vous";
            String content = buildEmailContent(request.getEmail());
            mailService.sendEmail("contact@propsight.fr", subject, content, false, true);
            LOG.info("Subscription email sent successfully for: {}", request.getEmail());
            return ResponseEntity.ok().body("{\"message\":\"Email sent successfully\"}");
        } catch (org.springframework.mail.MailAuthenticationException e) {
            LOG.error("SMTP Authentication failed. Please check email credentials and SMTP settings.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                "{\"error\":\"SMTP authentication failed. Please check server configuration.\"}"
            );
        } catch (org.springframework.mail.MailSendException e) {
            LOG.error("SMTP connection failed. Please check SMTP host and port settings.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                "{\"error\":\"SMTP connection failed. Please check server configuration.\"}"
            );
        } catch (Exception e) {
            LOG.error("Error sending subscription email for: {}", request.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                "{\"error\":\"Failed to send email. Please try again later.\"}"
            );
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        LOG.warn("Validation error: {}", ex.getMessage());
        return ResponseEntity.badRequest().body("{\"error\":\"Invalid email address\"}");
    }

    private String buildEmailContent(String email) {
        return (
            "<html><body>" +
            "<h2>Nouvelle inscription à la newsletter Propsight</h2>" +
            "<p>Un nouvel utilisateur s'est inscrit pour être prévenu des nouveautés :</p>" +
            "<p><strong>Email :</strong> " +
            email +
            "</p>" +
            "<p><strong>Date :</strong> " +
            java.time.LocalDateTime.now() +
            "</p>" +
            "</body></html>"
        );
    }

    public static class ContactRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        private String email;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
