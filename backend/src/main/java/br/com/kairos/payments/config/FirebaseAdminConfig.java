package br.com.kairos.payments.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.FirebaseDatabase;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
@ConditionalOnProperty(prefix = "kairos.firebase", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(FirebaseProperties.class)
public class FirebaseAdminConfig {

    @Bean
    FirebaseApp firebaseApp(FirebaseProperties properties) throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getApps().getFirst();
        }

        FirebaseOptions options = FirebaseOptions.builder()
            .setCredentials(resolveCredentials(properties))
            .setDatabaseUrl(properties.databaseUrl())
            .setProjectId(properties.projectId())
            .build();

        return FirebaseApp.initializeApp(options);
    }

    @Bean
    FirebaseDatabase firebaseDatabase(FirebaseApp firebaseApp) {
        return FirebaseDatabase.getInstance(firebaseApp);
    }

    private GoogleCredentials resolveCredentials(FirebaseProperties properties) throws IOException {
        if (StringUtils.hasText(properties.credentialsPath())) {
            try (InputStream inputStream = new FileInputStream(properties.credentialsPath())) {
                return GoogleCredentials.fromStream(inputStream);
            }
        }

        GoogleCredentials applicationDefault = GoogleCredentials.getApplicationDefault();
        return applicationDefault.createScoped(List.of(
            "https://www.googleapis.com/auth/firebase.database",
            "https://www.googleapis.com/auth/userinfo.email"
        ));
    }
}
