package org.ucg.resource;

import jakarta.ws.rs.GET;
import lombok.RequiredArgsConstructor;
import jakarta.ws.rs.Path;
import org.ucg.model.User;

@Path("/users")
@RequiredArgsConstructor
public class UserResource {

    @GET
    public User getCurrentUser() {
        return new User(); // todo: dodati request context i izvuci odatle
    }

    // set/change monthly limit @PATCH

}
