package org.ucg.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.ucg.model.ServiceProvider;
import org.ucg.model.Subscription;
import org.ucg.model.SubscriptionProvider;
import org.ucg.resource.model.ServiceProviderResponse;
import org.ucg.resource.model.SubscriptionProviderResponse;
import org.ucg.resource.model.SubscriptionResponse;

import java.util.UUID;

import static org.mapstruct.MappingConstants.ComponentModel.CDI;


@Mapper(componentModel = CDI, imports = UUID.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DataMapper {

    SubscriptionResponse toResponse(Subscription entity);

    SubscriptionProviderResponse toResponse(SubscriptionProvider entity);

    ServiceProviderResponse toResponse(ServiceProvider entity);
}
