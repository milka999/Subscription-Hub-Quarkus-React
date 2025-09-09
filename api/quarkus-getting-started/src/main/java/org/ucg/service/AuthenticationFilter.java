package org.ucg.service;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.ext.Provider;
import lombok.RequiredArgsConstructor;

import java.io.IOException;

@Provider
@PreMatching
@RequiredArgsConstructor
public class AuthenticationFilter implements ContainerRequestFilter {

    private final SecurityIdentity securityIdentity;
    private final RequestContext requestContext;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // ako ga nema u bazi, kreiraj ga
        var user = securityIdentity.getCredentials();

        //requestContext.setAuthUser();
    }
}