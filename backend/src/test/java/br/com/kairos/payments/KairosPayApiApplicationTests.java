package br.com.kairos.payments;

import com.google.firebase.database.FirebaseDatabase;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(properties = "kairos.firebase.enabled=false")
class KairosPayApiApplicationTests {

    @MockitoBean
    FirebaseDatabase firebaseDatabase;

    @Test
    void contextLoads() {
    }
}
