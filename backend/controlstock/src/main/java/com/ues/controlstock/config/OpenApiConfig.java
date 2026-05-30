package com.ues.controlstock.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

// Configuración de Swagger — documenta todos los endpoints de la API
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Control de Stock API")
                        .version("1.0")
                        .description("API REST para el sistema de gestión de inventario ControlStock")
                );
    }
}
