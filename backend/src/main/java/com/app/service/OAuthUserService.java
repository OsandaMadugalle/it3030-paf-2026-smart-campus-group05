package com.app.service;

import com.app.model.Role;
import com.app.model.User;
import com.app.repository.UserRepository;
import com.app.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
<<<<<<< HEAD
import java.util.Map;
=======
import java.util.Collections;
>>>>>>> develop
import java.util.Optional;

@Service
public class OAuthUserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
<<<<<<< HEAD
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String providerId = attributes.get("sub").toString();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String avatarUrl = (String) attributes.get("picture");

        Optional<User> userOptional = userRepository.findByProviderAndProviderId(provider, providerId);
        User user;

=======
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        System.out.println("DEBUG: OAuthUserService.loadUser called for provider: " + oAuth2UserRequest.getClientRegistration().getRegistrationId());
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (Exception ex) {
            System.out.println("DEBUG: Error in processOAuth2User: " + ex.getMessage());
            ex.printStackTrace();
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        
        System.out.println("DEBUG: Processing User Email: " + email);
        String name = oAuth2User.getAttribute("name");
        String avatarUrl = oAuth2User.getAttribute("picture");

        Optional<User> userOptional = userRepository.findByProviderAndProviderId(registrationId, providerId);
        User user;
>>>>>>> develop
        if (userOptional.isPresent()) {
            user = userOptional.get();
            user.setName(name);
            user.setAvatarUrl(avatarUrl);
            user.setUpdatedAt(LocalDateTime.now());
<<<<<<< HEAD
        } else {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setAvatarUrl(avatarUrl);
            user.setProvider(provider);
            user.setProviderId(providerId);
            user.getRoles().add(Role.ROLE_USER);
        }

        userRepository.save(user);

        return UserPrincipal.create(user, attributes);
=======
            user = userRepository.save(user);
        } else {
            user = registerNewUser(registrationId, providerId, email, name, avatarUrl);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(String provider, String providerId, String email, String name, String avatarUrl) {
        User user = new User();
        user.setProvider(provider);
        user.setProviderId(providerId);
        user.setEmail(email);
        user.setName(name);
        user.setAvatarUrl(avatarUrl);
        user.setRoles(Collections.singleton(Role.ROLE_USER));
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
>>>>>>> develop
    }
}
