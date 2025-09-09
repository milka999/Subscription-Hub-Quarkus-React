package org.ucg.service;

import jakarta.enterprise.context.RequestScoped;
import org.ucg.model.User;

import static java.util.Optional.ofNullable;

@RequestScoped
public class RequestContext {

    private final ThreadLocal<User> authenticatedUser = new ThreadLocal<>();

    public User getAuthUser() {
        return authenticatedUser.get();
    }

    public Long getAuthUserId() {
        return ofNullable(authenticatedUser.get()).map(User::getId).orElse(null);
    }

    public void setAuthenticatedUser(User user) {
        authenticatedUser.set(user);
    }

}
