package org.ucg.resource;

import jakarta.ws.rs.BeanParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import lombok.RequiredArgsConstructor;
import org.jboss.resteasy.reactive.RestPath;
import org.jboss.resteasy.reactive.RestQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.ucg.mapper.DataMapper;
import org.ucg.repository.ServiceProviderRepository;
import org.ucg.repository.SubscriptionProviderRepository;
import org.ucg.resource.model.PaginationParams;
import org.ucg.resource.model.ServiceProviderResponse;
import org.ucg.resource.model.SubscriptionProviderResponse;

import java.util.List;

@Path("providers")
@RequiredArgsConstructor
public class AvailableServicesResource {

    private final SubscriptionProviderRepository repository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final DataMapper mapper;

    @GET
    @Path("services")
    public Page<ServiceProviderResponse> getAll(@RestQuery String name, @BeanParam PaginationParams paginationParams){
        final var result = serviceProviderRepository.findAll(name , PageRequest.of(paginationParams.getPage(), paginationParams.getRows()));
        return result.map(mapper::toResponse);
    }

    @GET
    @Path("subscriptions/{serviceId:\\d*}")
    public List<SubscriptionProviderResponse> findAllByService(@RestPath Long serviceId){
        final var result = repository.findAllByServiceId(serviceId);
        return result.stream().map(mapper::toResponse).toList();
    }
}
