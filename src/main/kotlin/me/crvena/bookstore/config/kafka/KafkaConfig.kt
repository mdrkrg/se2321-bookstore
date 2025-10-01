package me.crvena.bookstore.config.kafka

import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.kafka.common.serialization.StringSerializer
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.ConsumerFactory
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.core.DefaultKafkaProducerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.core.ProducerFactory
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer
import org.springframework.kafka.listener.ContainerProperties
import org.springframework.kafka.listener.KafkaMessageListenerContainer
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate
import org.springframework.kafka.support.serializer.JsonDeserializer
import org.springframework.kafka.support.serializer.JsonSerializer
import java.time.Duration

@EnableKafka
@Configuration
class KafkaConfig(
    @Value(value = "\${spring.kafka.bootstrap-servers}")
    val bootstrapAddress: String,
    // @Value(value = "\${spring.kafka.group-id}")
    // val groupId: String,
) {
    @Bean
    fun kafkaMessageListenerContainer(consumerFactory: ConsumerFactory<String, Any>): KafkaMessageListenerContainer<String, Any> {
        val replyTopic = "reply_topic"
        val containerProperties = ContainerProperties(replyTopic)
        return KafkaMessageListenerContainer(consumerFactory, containerProperties)
    }
    // @Bean
    // fun producerFactory(): ProducerFactory<String, Any> =
    //     DefaultKafkaProducerFactory(
    //         mapOf(
    //             ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to bootstrapAddress,
    //             ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java,
    //             ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to JsonSerializer::class.java,
    //         ),
    //     )

    @Bean
    @Qualifier("kafkaTemplate")
    fun kafkaTemplate(producerFactory: ProducerFactory<String, Any>): KafkaTemplate<String, Any> = KafkaTemplate(producerFactory)

    // @Bean
    // fun consumerFactory(): ConsumerFactory<String, Any> {
    //     val deserializer = JsonDeserializer<Any>()
    //     // trust my package
    //     deserializer.addTrustedPackages("me.crvena.bookstore.*")

    //     return DefaultKafkaConsumerFactory(
    //         mapOf(
    //             ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to bootstrapAddress,
    //             ConsumerConfig.GROUP_ID_CONFIG to groupId,
    //         ),
    //         StringDeserializer(),
    //         deserializer,
    //     )
    // }

    // @Bean
    // fun kafkaListenerContainerFactory(kafkaTemplate: KafkaTemplate<String, Any>): ConcurrentKafkaListenerContainerFactory<String, Any> {
    //     val factory = ConcurrentKafkaListenerContainerFactory<String, Any>()
    //     factory.consumerFactory = consumerFactory()
    //     factory.setReplyTemplate(kafkaTemplate)
    //     return factory
    // }

    @Bean
    fun kafkaListenerContainerFactory(
        consumerFactory: ConsumerFactory<String, Any>,
        kafkaTemplate: KafkaTemplate<String, Any>,
    ): ConcurrentKafkaListenerContainerFactory<String, Any> {
        val factory = ConcurrentKafkaListenerContainerFactory<String, Any>()
        factory.consumerFactory = consumerFactory
        factory.setReplyTemplate(kafkaTemplate)
        return factory
    }

    // @Bean
    // fun repliesContainer(
    //     containerFactory: ConcurrentKafkaListenerContainerFactory<String, Any>,
    // ): ConcurrentMessageListenerContainer<String, Any> {
    //     val container = containerFactory.createContainer("bookstore_order_reply")
    //     container.containerProperties.setGroupId("my-reply-group")
    //     container.isAutoStartup = false
    //     return container
    // }

    // @Bean
    // fun replyingKafkaTemplate(
    //     producerFactory: ProducerFactory<String, Any>,
    //     repliesContainer: ConcurrentMessageListenerContainer<String, Any>,
    // ): ReplyingKafkaTemplate<String, Any, Any> = ReplyingKafkaTemplate(producerFactory, repliesContainer)

    @Bean
    fun replyingKafkaTemplate(
        producerFactory: ProducerFactory<String, Any>,
        repliesContainer: KafkaMessageListenerContainer<String, Any>,
    ): ReplyingKafkaTemplate<String, Any, Any> {
        val replyTimeout = Duration.ofSeconds(10)
        val replyingKafkaTemplate = ReplyingKafkaTemplate(producerFactory, repliesContainer)
        replyingKafkaTemplate.setDefaultReplyTimeout(replyTimeout)
        return replyingKafkaTemplate
    }
}
