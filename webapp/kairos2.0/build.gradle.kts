plugins {
	java
	id("org.springframework.boot") version "3.5.6"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.mov.kairos.kairos"
version = "0.0.1-SNAPSHOT"
description = "site com inscricao para retiro do movimento kairos"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
	val testImplementation by getting
	val testRuntimeOnly by getting
	create("archTestImplementation") {
		extendsFrom(testImplementation)
	}
	create("archTestRuntimeOnly") {
		extendsFrom(testRuntimeOnly)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.flywaydb:flyway-core")
	implementation("org.flywaydb:flyway-database-postgresql")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("com.h2database:h2")
	runtimeOnly("org.postgresql:postgresql")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testImplementation("com.tngtech.archunit:archunit-junit5:1.3.0")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

sourceSets {
	val main by getting
	val test by getting
	create("archTest") {
		java.srcDir("src/archTest/java")
		resources.srcDir("src/archTest/resources")
		compileClasspath += main.output + test.output + configurations["testCompileClasspath"]
		runtimeClasspath += output + compileClasspath + configurations["testRuntimeClasspath"]
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.register<Test>("archTest") {
	description = "Executa os testes de arquitetura (ArchUnit)."
	group = "verification"

	val archTestSourceSet = sourceSets["archTest"]
	testClassesDirs = archTestSourceSet.output.classesDirs
	classpath = archTestSourceSet.runtimeClasspath
	shouldRunAfter(tasks.named("test"))
}

tasks.named("check") {
	dependsOn("archTest")
}
