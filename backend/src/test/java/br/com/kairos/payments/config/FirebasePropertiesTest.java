package br.com.kairos.payments.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FirebasePropertiesTest {

    @Test
    void deveExporOsValoresInformadosNoRecord() {
        FirebaseProperties properties = new FirebaseProperties(
            "https://kairos.firebaseio.com",
            "kairos",
            "/tmp/firebase.json"
        );

        assertThat(properties.databaseUrl()).isEqualTo("https://kairos.firebaseio.com");
        assertThat(properties.projectId()).isEqualTo("kairos");
        assertThat(properties.credentialsPath()).isEqualTo("/tmp/firebase.json");
    }
}
