package org.ucg.mapper;

import jakarta.inject.Inject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.ucg.model.ServiceProvider;
import org.ucg.model.Subscription;
import org.ucg.model.SubscriptionProvider;
import org.ucg.repository.SubscriptionProviderRepository;
import org.ucg.resource.model.ServiceProviderResponse;
import org.ucg.resource.model.SubscriptionProviderResponse;
import org.ucg.resource.model.SubscriptionRequest;
import org.ucg.resource.model.SubscriptionResponse;
import org.ucg.service.SubscriptionService;

import java.util.UUID;

import static org.mapstruct.MappingConstants.ComponentModel.CDI;


@Mapper(componentModel = CDI, imports = UUID.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class DataMapper {

    @Inject
    SubscriptionProviderRepository serviceRepository;

    public abstract SubscriptionResponse toResponse(Subscription entity);

    public abstract SubscriptionProviderResponse toResponse(SubscriptionProvider entity);

    public abstract ServiceProviderResponse toResponse(ServiceProvider entity);

    @Mapping(target = "provider", source = "providerId", qualifiedByName = "getProvider")
    public abstract Subscription toEntity(SubscriptionRequest request);

    @Named("getProvider")
    public SubscriptionProvider getService(Long providerId){
        return serviceRepository.findById(providerId).orElse(null);
    }
}
