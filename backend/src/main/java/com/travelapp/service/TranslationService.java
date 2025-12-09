package com.travelapp.service;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class TranslationService {

    private static final Logger logger = LoggerFactory.getLogger(TranslationService.class);

    @Value("${google.translate.api.key:}")
    private String apiKey;

    @Value("${google.translate.api.url:https://translation.googleapis.com/language/translate/v2}")
    private String apiUrl;

    public TranslationService() {
        // Constructor will be called after @Value injection
    }

    @jakarta.annotation.PostConstruct
    public void init() {
        if (apiKey == null || apiKey.isEmpty()) {
            logger.warn("Google Translate API key is not set. Translation will return original text.");
        } else {
            logger.info("Google Translate API key is configured (length: {})", apiKey.length());
        }
    }

    /**
     * Translate text from Thai to English using Google Translate API
     */
    public String translateToEnglish(String text) {
        if (text == null || text.trim().isEmpty() || apiKey == null || apiKey.isEmpty()) {
            return text;
        }

        try {
            RestClient restClient = RestClient.create();
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("q", text);
            requestBody.put("target", "en");
            requestBody.put("source", "th");
            requestBody.put("format", "text");

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .body(requestBody)
                .retrieve()
                .onStatus(status -> status.isError(), (request, response1) -> {
                    // Log error response
                    logger.error("Google Translate API error: HTTP {} - {}", 
                        response1.getStatusCode(), response1.getStatusText());
                    throw new RuntimeException("Translation API error: " + response1.getStatusCode());
                })
                .body(Map.class);

            // Check for error response (API returns 200 but with error object)
            if (response != null && response.containsKey("error")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> error = (Map<String, Object>) response.get("error");
                String errorMessage = (String) error.get("message");
                logger.error("Google Translate API error: {}", errorMessage);
                return text; // Return original text on error
            }

            if (response != null && response.containsKey("data")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                @SuppressWarnings("unchecked")
                java.util.List<Map<String, Object>> translations = (java.util.List<Map<String, Object>>) data.get("translations");
                if (translations != null && !translations.isEmpty()) {
                    return (String) translations.get(0).get("translatedText");
                }
            }
        } catch (Exception e) {
            String preview = text.length() > 0 
                ? text.substring(0, Math.min(50, text.length())) 
                : "(empty)";
            logger.warn("Translation failed for text: {} (length: {}), error: {}", 
                preview, text.length(), e.getMessage());
        }

        return text; // Return original text if translation fails
    }

    /**
     * Create translations map with Thai and English versions
     */
    public Map<String, Map<String, String>> createTranslations(String thaiTitle, String thaiDescription) {
        Map<String, Map<String, String>> translations = new HashMap<>();
        
        // Thai translations
        Map<String, String> th = new HashMap<>();
        th.put("title", thaiTitle != null ? thaiTitle : "");
        th.put("description", thaiDescription != null ? thaiDescription : "");
        translations.put("th", th);

        // English translations (translate from Thai)
        Map<String, String> en = new HashMap<>();
        en.put("title", translateToEnglish(thaiTitle));
        en.put("description", translateToEnglish(thaiDescription));
        translations.put("en", en);

        return translations;
    }
}

