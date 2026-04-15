package br.com.kairos.payments.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.FirebaseDatabase;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.MockedStatic;

class FirebaseAdminConfigTest {

    private final FirebaseAdminConfig firebaseAdminConfig = new FirebaseAdminConfig();

    @Test
    void deveReutilizarFirebaseAppExistenteQuandoJaInicializado() throws Exception {
        FirebaseApp existingApp = mock(FirebaseApp.class);

        try (MockedStatic<FirebaseApp> firebaseAppMock = mockStatic(FirebaseApp.class)) {
            firebaseAppMock.when(FirebaseApp::getApps).thenReturn(List.of(existingApp));

            FirebaseApp app = firebaseAdminConfig.firebaseApp(
                new FirebaseProperties("https://kairos.firebaseio.com", "kairos", null)
            );

            assertThat(app).isSameAs(existingApp);
        }
    }

    @Test
    void deveInicializarFirebaseAppComCredenciaisDeArquivo(@TempDir Path tempDir) throws Exception {
        Path credentialsFile = Files.writeString(tempDir.resolve("firebase.json"), "{}");
        GoogleCredentials credentials = mock(GoogleCredentials.class);
        FirebaseApp firebaseApp = mock(FirebaseApp.class);

        try (
            MockedStatic<FirebaseApp> firebaseAppMock = mockStatic(FirebaseApp.class);
            MockedStatic<GoogleCredentials> credentialsMock = mockStatic(GoogleCredentials.class)
        ) {
            firebaseAppMock.when(FirebaseApp::getApps).thenReturn(List.of());
            credentialsMock.when(() -> GoogleCredentials.fromStream(org.mockito.ArgumentMatchers.any()))
                .thenReturn(credentials);
            firebaseAppMock.when(() -> FirebaseApp.initializeApp(org.mockito.ArgumentMatchers.any(FirebaseOptions.class)))
                .thenReturn(firebaseApp);

            FirebaseApp app = firebaseAdminConfig.firebaseApp(
                new FirebaseProperties("https://kairos.firebaseio.com", "kairos", credentialsFile.toString())
            );

            assertThat(app).isSameAs(firebaseApp);
        }
    }

    @Test
    void deveInicializarFirebaseAppComApplicationDefaultQuandoNaoHouverArquivo() throws Exception {
        GoogleCredentials applicationDefault = mock(GoogleCredentials.class);
        GoogleCredentials scopedCredentials = mock(GoogleCredentials.class);
        FirebaseApp firebaseApp = mock(FirebaseApp.class);
        when(applicationDefault.createScoped(org.mockito.ArgumentMatchers.anyList())).thenReturn(scopedCredentials);

        try (
            MockedStatic<FirebaseApp> firebaseAppMock = mockStatic(FirebaseApp.class);
            MockedStatic<GoogleCredentials> credentialsMock = mockStatic(GoogleCredentials.class)
        ) {
            firebaseAppMock.when(FirebaseApp::getApps).thenReturn(List.of());
            credentialsMock.when(GoogleCredentials::getApplicationDefault).thenReturn(applicationDefault);
            firebaseAppMock.when(() -> FirebaseApp.initializeApp(org.mockito.ArgumentMatchers.any(FirebaseOptions.class)))
                .thenReturn(firebaseApp);

            FirebaseApp app = firebaseAdminConfig.firebaseApp(
                new FirebaseProperties("https://kairos.firebaseio.com", "kairos", null)
            );

            assertThat(app).isSameAs(firebaseApp);
        }
    }

    @Test
    void deveObterFirebaseDatabaseAPartirDoFirebaseApp() {
        FirebaseApp firebaseApp = mock(FirebaseApp.class);
        FirebaseDatabase firebaseDatabase = mock(FirebaseDatabase.class);

        try (MockedStatic<FirebaseDatabase> databaseMock = mockStatic(FirebaseDatabase.class)) {
            databaseMock.when(() -> FirebaseDatabase.getInstance(firebaseApp)).thenReturn(firebaseDatabase);

            FirebaseDatabase resultado = firebaseAdminConfig.firebaseDatabase(firebaseApp);

            assertThat(resultado).isSameAs(firebaseDatabase);
        }
    }
}
