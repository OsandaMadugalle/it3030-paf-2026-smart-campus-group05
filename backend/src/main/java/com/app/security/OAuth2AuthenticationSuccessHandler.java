package com.app.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        try {
            System.out.println("DEBUG: Entering onAuthenticationSuccess");
            String token = tokenProvider.generateToken(authentication);
            System.out.println("DEBUG: Generated Token: " + token);

            String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/callback")
                    .queryParam("token", token)
                    .build().toUriString();
            
            System.out.println("DEBUG: Redirecting to: " + targetUrl);

            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } catch (Exception e) {
            System.err.println("DEBUG: Fatal error in onAuthenticationSuccess: " + e.getMessage());
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Authentication success handling failed");
        }
    }
}
