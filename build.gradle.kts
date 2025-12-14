import org.springframework.boot.gradle.tasks.run.BootRun

buildscript {
    dependencies {
        classpath("org.flywaydb:flyway-database-postgresql:11.8.0")
    }
}

plugins {
    java
    eclipse
    kotlin("jvm") version "2.2.20"
    kotlin("plugin.spring") version "2.2.20"
    // kotlin("kapt") version "2.2.20"
    kotlin("plugin.lombok") version "2.2.20"
    id("io.freefair.lombok") version "8.14.2"
    id("org.springframework.boot") version "3.5.0"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.asciidoctor.jvm.convert") version "3.3.2"
    id("org.flywaydb.flyway") version "11.8.0"
    id("co.uzzu.dotenv.gradle") version "4.0.0"
}

group = "me.crvena"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
    mavenLocal()
}

// Define extra property for snippetsDir
val snippetsDir by extra { file("build/generated-snippets") }

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-cache")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    // implementation("org.springframework.boot:spring-boot-starter-data-rest")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-graphql")
    implementation("com.graphql-java:graphql-java-extended-scalars:24.0")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-hibernate6:2.19.2")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.flywaydb:flyway-core:11.8.0")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("commons-io:commons-io:2.20.0")
    implementation("org.springframework.kafka:spring-kafka:3.3.10")
    // implementation("org.springframework.data:spring-data-rest-hal-explorer")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("software.amazon.awssdk:s3:2.31.68")
    implementation("com.google.guava:guava:33.4.8-jre")
    // implementation("tech.ailef:snap-admin:0.2.3") // WARN: requires NoArgsConstructor
    compileOnly("org.projectlombok:lombok")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("org.postgresql:postgresql")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.restdocs:spring-restdocs-mockmvc")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.named<Test>("test") {
    outputs.dir(snippetsDir)
    useJUnitPlatform()
}

tasks.named("asciidoctor") {
    inputs.dir(snippetsDir)
    dependsOn(tasks.test)
}

tasks.named<BootRun>("bootRun") {
    systemProperty("spring.profiles.active", "dev")
}

flyway {
    // Accessing environment variables via the co.uzzu.dotenv extension
    url = env.fetch("DATABASE_URL")
    user = env.fetch("DATABASE_USERNAME")
    password = env.fetch("DATABASE_PASSWORD")
}
