package org.ucg.resource;

import jakarta.ws.rs.*;
import lombok.RequiredArgsConstructor;
import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;
import org.ucg.mapper.DataMapper;
import org.ucg.model.Subscription;
import org.ucg.model.enums.SubscriptionStatus;
import org.ucg.repository.SubscriptionRepository;
import org.ucg.repository.UserRepository;
import org.ucg.resource.model.StatisticsResponse;
import org.ucg.resource.model.SubscriptionRequest;
import org.ucg.resource.model.SubscriptionResponse;
import org.ucg.service.RequestContext;
import org.ucg.service.SubscriptionService;

import java.util.List;

@Path("subscriptions")
@RequiredArgsConstructor
public class ManageSubscriptions {

    private final SubscriptionRepository repository;
    private final DataMapper mapper;
    private final RequestContext requestContext;
    private final UserRepository userRepository;
    private final SubscriptionService service;

    @GET
    @Path("/{subscriptionId:\\d+}")
    public SubscriptionResponse getSubscription(@RestPath Long subscriptionId) {
        final var entity = repository.findById(subscriptionId).orElseThrow(() -> new NotFoundException("Subscription not found"));

        return mapper.toResponse(entity);
    }

    @GET
    public List<SubscriptionResponse> getSubscriptions(@RestQuery SubscriptionStatus status) {
        return requestContext.getAuthUser().getSubscriptions().stream().filter(a -> filterByStatus(a, status)).map(mapper::toResponse).toList();
    }

    private boolean filterByStatus(Subscription subscription, SubscriptionStatus status) {
        return status == null || subscription.getStatus().equals(status);
    }

    @POST
    public SubscriptionResponse addNewSubscription(SubscriptionRequest request){
        var entity = mapper.toEntity(request);
        var savedEntity = repository.save(entity);

        var user = requestContext.getAuthUser();
        user.getSubscriptions().add(savedEntity);

        userRepository.save(user);

        return mapper.toResponse(savedEntity);
    }

    @DELETE
    @Path("{subscriptionId:\\d*}")
    public void removeSubscription(@RestPath Long subscriptionId){
        repository.deleteById(subscriptionId);
    }

    @PATCH
    @Path("{subscriptionId:\\d*}")
    public void changeStatus(@RestPath Long subscriptionId, @RestQuery SubscriptionStatus status){
        var sub = repository.findById(subscriptionId).orElseThrow(() -> new NotFoundException("Subscription not found"));
        sub.setStatus(status);
        repository.save(sub);
    }

    @GET
    @Path("/stats")
    public StatisticsResponse getStatusForCurrentUser(){
        var user = requestContext.getAuthUser();
        return service.getUserStatistics(user.getId());
    }
}
