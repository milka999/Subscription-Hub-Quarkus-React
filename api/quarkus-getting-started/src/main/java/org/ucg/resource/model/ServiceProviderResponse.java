package org.ucg.resource.model;

import lombok.Data;

@Data
public class ServiceProviderResponse {

    private Long id;
    private String name;
    private String contactEmail;
    private String websiteUrl;
    private String cancellationUrl;
    private String renewalUrl;
}
