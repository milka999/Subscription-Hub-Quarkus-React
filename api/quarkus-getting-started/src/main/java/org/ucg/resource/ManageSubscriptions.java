package org.ucg.resource;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.Path;
import lombok.RequiredArgsConstructor;
import org.jboss.resteasy.reactive.RestPath;
import org.springframework.data.domain.Page;
import org.ucg.mapper.DataMapper;
import org.ucg.repository.SubscriptionRepository;
import org.ucg.resource.model.SubscriptionResponse;

@Path("subscriptions")
@RequiredArgsConstructor
public class ManageSubscriptions {

    private final SubscriptionRepository repository;
    private final DataMapper mapper;

    @GET
    @Path("/{subscriptionId:\\d+}")
    public SubscriptionResponse getSubscription(@RestPath Long subscriptionId){
        final var entity = repository.findById(subscriptionId).orElseThrow(() -> new NotFoundException("Subscription not found"));

        return mapper.toResponse(entity);
    }

    // view all subscriptions (sa filterima)

    // add new subscription, ili odabrati od postojecih ili dodati rucno novu

    // delete

    // put (change tier etc)

    // get statistics - odje ide projekcija

    // todo: migracija za popularne subscription-e, npr spotify, netflix, etc.

    // todo: flyway migracija + config
}
