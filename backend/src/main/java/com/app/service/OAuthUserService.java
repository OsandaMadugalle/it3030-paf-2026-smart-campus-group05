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
import java.util.Map;
import java.util.Optional;

@Service
public class OAuthUserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
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

        if (userOptional.isPresent()) {
            user = userOptional.get();
            user.setName(name);
            user.setAvatarUrl(avatarUrl);
            user.setUpdatedAt(LocalDateTime.now());
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
    }
}
